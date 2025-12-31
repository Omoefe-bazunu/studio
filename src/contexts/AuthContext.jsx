"use client";

import * as React from "react";
import { onAuthStateChangedWrapper } from "@/lib/firebase/auth";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const ADMIN_EMAIL = "raniem57@gmail.com";

  // 1. Sync with Firebase Auth
  React.useEffect(() => {
    const unsubscribe = onAuthStateChangedWrapper((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Determine Admin Status
  const isAdmin = React.useMemo(() => {
    return !!currentUser && currentUser.email === ADMIN_EMAIL;
  }, [currentUser]);

  // 3. Global Route Protection
  React.useEffect(() => {
    if (!loadingAuth) {
      // If not logged in and trying to access private areas
      const isPrivateRoute =
        pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

      if (!currentUser && isPrivateRoute) {
        router.push("/login");
      }

      // If logged in but not admin trying to access admin areas
      if (currentUser && pathname.startsWith("/admin") && !isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [currentUser, loadingAuth, isAdmin, pathname, router]);

  const value = {
    currentUser,
    loadingAuth,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
