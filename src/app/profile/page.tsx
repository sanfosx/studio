
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-provider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Logo } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher, ThemeToggle } from '@/components/header';
import Link from 'next/link';
import { Home, Pencil, X, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type EditableField = 'name' | 'phone';

function ProfilePageContent() {
  const { user, auth } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [clientDocId, setClientDocId] = React.useState<string | null>(null);
  const [clientData, setClientData] = React.useState<ProfileFormValues | null>(null);
  const [editingField, setEditingField] = React.useState<EditableField | null>(null);
  const [fieldValue, setFieldValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();


  React.useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      if (user) {
        const q = query(collection(db, "clients"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const clientDoc = querySnapshot.docs[0];
          setClientDocId(clientDoc.id);
          setClientData(clientDoc.data() as ProfileFormValues);
        } else {
            router.push('/');
        }
      }
      setIsLoading(false);
    };
    fetchClientData();
  }, [user, router]);

  const handleEdit = (field: EditableField) => {
    if (!clientData) return;
    setEditingField(field);
    setFieldValue(clientData[field]);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValue('');
  };

  const handleSave = async () => {
    if (!clientDocId || !editingField || !clientData) return;

    if (fieldValue.trim() === '') {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "El campo no puede estar vacío.",
        });
        return;
    }
    
    if (fieldValue === clientData[editingField]) {
        setEditingField(null);
        return;
    }

    try {
      const clientRef = doc(db, 'clients', clientDocId);
      await updateDoc(clientRef, { [editingField]: fieldValue });
      setClientData(prev => prev ? { ...prev, [editingField]: fieldValue } : null);
      toast({
        title: "Éxito",
        description: "Tu perfil ha sido actualizado.",
      });
      setEditingField(null);
    } catch (error) {
      console.error(`Error updating ${editingField}: `, error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: `No se pudo actualizar tu ${editingField}.`,
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

  const renderField = (label: string, field: EditableField) => {
    const isEditing = editingField === field;
    
    return (
        <div className='space-y-2'>
            <label className="text-sm font-medium">{label}</label>
            {isLoading ? <Skeleton className="h-10 w-full" /> : 
             !clientData ? <p>Error loading data</p> :
             (
                <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                    <Input 
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                    <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4 text-red-500" />
                    </Button>
                    </>
                ) : (
                    <>
                    <p className="flex-1 h-10 flex items-center px-3 rounded-md border border-input bg-background/50">
                        {clientData[field]}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(field)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    </>
                )}
                </div>
            )}
        </div>
    )
  }


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
                <CardContent className='space-y-6'>
                    {renderField('Nombre', 'name')}
                    {renderField('Teléfono', 'phone')}
                    
                    <div className='space-y-2'>
                        <label className="text-sm font-medium">Email</label>
                        {isLoading ? <Skeleton className="h-10 w-full" /> : (
                            <Input value={clientData?.email || ''} readOnly disabled />
                        )}
                    </div>
                   
                    <Button type="button" variant="outline" onClick={handleSendResetPassword} className="w-full !mt-8">
                        Cambiar Contraseña
                    </Button>

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
