
'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { isFirebaseConfigured, db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

const registerSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const { signIn, user, auth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const firebaseConfigured = isFirebaseConfigured();
  const [activeTab, setActiveTab] = React.useState('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', email: '', password: '' },
  });

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!firebaseConfigured) return;
    setIsLoading(true);
    try {
      const userCredential = await signIn(data.email, data.password);
      
      // Check user role from firestore
      const q = query(collection(db, "clients"), where("uid", "==", userCredential.user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        if (userDoc.role === 'cliente') {
            router.push('/');
        } else {
            router.push('/admin');
        }
      } else {
        // Default to admin if not found in clients (or handle as error)
        router.push('/admin');
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Las credenciales son incorrectas. Por favor, inténtalo de nuevo.",
      })
      console.error('Failed to sign in:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (!firebaseConfigured || !auth) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await addDoc(collection(db, 'clients'), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'cliente'
      });
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
      });
      setActiveTab('login');

    } catch (error: any) {
        if(error.code === 'auth/email-already-in-use') {
             toast({
                variant: "destructive",
                title: "Error de registro",
                description: "Este correo electrónico ya está en uso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error de registro",
                description: "No se pudo crear la cuenta. Inténtalo de nuevo.",
            });
        }
      console.error('Failed to register:', error);
    } finally {
        setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (user) {
        router.push('/admin'); // Redirect if already logged in
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4 cursor-pointer" onClick={() => router.push('/')}>
              <Logo className="size-10 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">Pizzeria Los Genios</CardTitle>
            </div>
          <CardDescription>Bienvenido. Inicia sesión o crea una cuenta para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          {!firebaseConfigured && (
            <Alert variant="destructive" className="mb-6">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Configuración Requerida</AlertTitle>
              <AlertDescription>
                La configuración de Firebase no se ha encontrado. Por favor, crea un archivo `.env.local` con tus credenciales y reinicia el servidor.
              </AlertDescription>
            </Alert>
          )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 pt-6">
                    <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="usuario@sabores.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading || !firebaseConfigured}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="register">
                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6 pt-6">
                        <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={registerForm.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="555-123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={registerForm.control}
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
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading || !firebaseConfigured}>
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

