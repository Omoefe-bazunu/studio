
"use client";

import * as React from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChangedWrapper } from '@/lib/firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loadingAuth: boolean;
  isAdmin: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const adminEmail = "raniem57@gmail.com"; // Corrected Admin email

  React.useEffect(() => {
    const unsubscribe = onAuthStateChangedWrapper((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);
  
  const isAdmin = React.useMemo(() => {
    // Admin is based on email.
    return !!currentUser && currentUser.email === adminEmail;
  }, [currentUser, adminEmail]);


  // Basic protected route logic (example for a dashboard)
  React.useEffect(() => {
    if (!loadingAuth && !currentUser && pathname === '/dashboard') {
      router.push('/login');
    }
  }, [currentUser, loadingAuth, pathname, router]);

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

