'use client';

import * as React from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
  where,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { KeyRound, Mail, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  role: z.string().default('cliente'),
});

type Client = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(
    null
  );

  const form = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'cliente',
    },
  });

  const clientsCollectionRef = collection(db, 'clients');

  const fetchClients = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(clientsCollectionRef, orderBy('name'));
      const data = await getDocs(q);
      const fetchedClients = data.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Client)
      );
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch clients from the database.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  React.useEffect(() => {
    if (isFormOpen) {
      if (editingClient) {
        form.reset({ ...editingClient });
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
          address: '',
          role: 'cliente',
        });
      }
    }
  }, [isFormOpen, editingClient, form]);

  const generateTempPassword = () => {
    return Math.random().toString(36).slice(-8) + 'A1!';
  };

  const onSubmit = async (data: Client) => {
    setIsSubmitting(true);
    try {
      if (editingClient && editingClient.id) {
        const clientDoc = doc(db, 'clients', editingClient.id);
        await updateDoc(clientDoc, data);
        toast({
          title: 'Éxito',
          description: 'Cliente actualizado correctamente.',
        });
      } else {
        const tempPassword = generateTempPassword();
        try {
          const clientData = {
            ...data,
            role: 'cliente',
          };
          
          const docRef = await addDoc(clientsCollectionRef, clientData);

          try {
             const userCredential = await createUserWithEmailAndPassword(
              auth,
              data.email,
              tempPassword
            );
            const user = userCredential.user;

            await updateDoc(docRef, { uid: user.uid });

            await sendPasswordResetEmail(auth, data.email);

             toast({
              title: 'Éxito',
              description:
                'Cliente creado. Se ha enviado un enlace para restablecer la contraseña.',
            });
          } catch (authError: any) {
             await deleteDoc(docRef);

            if (authError.code === 'auth/email-already-in-use') {
                toast({
                variant: 'destructive',
                title: 'Error de creación',
                description: 'Este correo electrónico ya está registrado.',
                });
            } else {
                console.error('Authentication error:', authError);
                toast({
                    variant: 'destructive',
                    title: 'Error de autenticación',
                    description: 'No se pudo crear el usuario. Verifique la consola.'
                })
            }
             setIsSubmitting(false);
             return;
          }

        } catch (dbError) {
             console.error('Firestore error:', dbError);
             toast({
                variant: 'destructive',
                title: 'Error de Base de Datos',
                description: 'No se pudo guardar el cliente en la base de datos.'
            });
             setIsSubmitting(false);
             return;
        }
      }
      await fetchClients();
      setIsFormOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'No se pudo guardar el cliente. Verifique la consola para más detalles.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      const clientDoc = doc(db, 'clients', id);
      await deleteDoc(clientDoc);
      toast({
        title: 'Éxito',
        description: 'Cliente eliminado correctamente.',
      });
      await fetchClients();
    } catch (error) {
      console.error('Error deleting client: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el cliente.',
      });
    }
  };
  
  const handleSendResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Correo Enviado',
        description: `Se ha enviado un enlace de restablecimiento de contraseña a ${email}.`
      });
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar el correo de restablecimiento de contraseña.',
      });
    }
  }


  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const openNewDialog = () => {
    setEditingClient(null);
    form.reset({ name: '', email: '', phone: '', address: '' });
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('clients')}</h1>
          <p className="text-muted-foreground">
            {t('client_management_subtitle')}
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('add_client')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? t('edit_client') : t('add_client')}
              </DialogTitle>
              <DialogDescription>
                {editingClient
                  ? t('edit_client_description')
                  : t('add_client_description')}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          {...field}
                          readOnly={!!editingClient}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder="555-111-2222" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Siempre Viva 742" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isSubmitting}
                    >
                      {t('cancel')}
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Guardando...'
                      : editingClient
                      ? t('save_changes')
                      : t('create_client')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSendResetPassword(client.email)}
                      title="Enviar enlace de reseteo de contraseña"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Enviar enlace de reseteo</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(client)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{t('edit')}</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">{t('delete')}</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('delete_confirmation_title')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('delete_confirmation_description')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(client.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
