
'use client';

import * as React from 'react';
import { useAuth, ProtectedRoute } from '@/contexts/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-provider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Logo } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher, ThemeToggle } from '@/components/header';
import Link from 'next/link';
import { Home } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfilePageContent() {
  const { user, auth } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [clientDocId, setClientDocId] = React.useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  React.useEffect(() => {
    const fetchClientData = async () => {
      if (user) {
        const q = query(collection(db, "clients"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const clientDoc = querySnapshot.docs[0];
          setClientDocId(clientDoc.id);
          form.reset(clientDoc.data() as ProfileFormValues);
        } else {
            // This might happen if user was created in auth but not in firestore
            // Or if user is an admin. Admins should not see this page.
             router.push('/');
        }
      }
    };
    fetchClientData();
  }, [user, form, router]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!clientDocId) return;
    try {
      const clientRef = doc(db, 'clients', clientDocId);
      await updateDoc(clientRef, { name: data.name, phone: data.phone });
      toast({
        title: "Éxito",
        description: "Tu perfil ha sido actualizado.",
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "No se pudo actualizar tu perfil.",
      });
    }
  };

  const handleSendResetPassword = async () => {
    if (user?.email && auth) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast({
          title: 'Correo Enviado',
          description: `Se ha enviado un enlace de restablecimiento de contraseña a ${user.email}.`
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
  };

  return (
    <div className='flex flex-col min-h-screen bg-secondary'>
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <span className="text-xl font-bold font-headline text-primary">Pizzeria Los Genios</span>
            </Link>
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/">
                        <Home className='mr-2'/>
                        Home
                    </Link>
                </Button>
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            </div>
      </header>
        <div className="flex flex-1 items-center justify-center py-12">
            <Card className="w-full max-w-lg">
                <CardHeader>
                <CardTitle>{t('myProfile')}</CardTitle>
                <CardDescription>Actualiza tu información personal aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                            <Input {...field} />
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
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                            <Input {...field} />
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
                            <Input {...field} readOnly disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className='space-y-4'>
                        <Button type="submit" className="w-full">
                            {t('save_changes')}
                        </Button>
                         <Button type="button" variant="outline" onClick={handleSendResetPassword} className="w-full">
                            Cambiar Contraseña
                        </Button>
                    </div>

                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </div>

  );
}


export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfilePageContent />
        </ProtectedRoute>
    )
}
