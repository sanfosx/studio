'use client';

import * as React from 'react';
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
  DialogClose
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
  } from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
});

type Client = z.infer<typeof clientSchema>;

const initialClients: Client[] = [
  { id: '1', name: 'Juan Perez', email: 'juan.perez@example.com', phone: '555-1234' },
  { id: '2', name: 'Maria Garcia', email: 'maria.garcia@example.com', phone: '555-5678' },
  { id: '3', name: 'Carlos Sanchez', email: 'carlos.sanchez@example.com', phone: '555-8765' },
];

export default function ClientsPage() {
  const { t } = useLanguage();
  const [clients, setClients] = React.useState<Client[]>(initialClients);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);

  const form = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (isFormOpen) {
        if (editingClient) {
            form.reset(editingClient);
        } else {
            form.reset({ name: '', email: '', phone: '' });
        }
    }
  }, [isFormOpen, editingClient, form]);

  const onSubmit = (data: Client) => {
    if (editingClient) {
      // Update
      setClients(clients.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c)));
    } else {
      // Create
      setClients([...clients, { ...data, id: String(clients.length + 1) }]);
    }
    setEditingClient(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    setClients(clients.filter((c) => c.id !== id));
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingClient(null);
    form.reset({ name: '', email: '', phone: '' });
    setIsFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('clients')}</h1>
          <p className="text-muted-foreground">{t('client_management_subtitle')}</p>
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
              <DialogTitle>{editingClient ? t('edit_client') : t('add_client')}</DialogTitle>
              <DialogDescription>
                {editingClient ? t('edit_client_description') : t('add_client_description')}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                        <Input placeholder="john.doe@example.com" {...field} />
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancel')}</Button>
                  </DialogClose>
                  <Button type="submit">{editingClient ? t('save_changes') : t('create_client')}</Button>
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
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
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
                            <AlertDialogTitle>{t('delete_confirmation_title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('delete_confirmation_description')}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(client.id)} className="bg-destructive hover:bg-destructive/90">{t('delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
