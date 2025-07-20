'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseConfigured]);
  
  const signIn = (email: string, pass: string) => {
    if (!firebaseConfigured) {
      return Promise.reject(new Error("Firebase not configured"));
    }
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const signOut = async () => {
    if (!firebaseConfigured) return;
    await firebaseSignOut(auth);
  };

  const value = { user, loading, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
             <div className="flex h-screen w-full items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
};
