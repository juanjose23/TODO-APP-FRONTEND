"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserDto } from "../dto/user.dto";
import { useRouter } from "next/navigation";
import { logoutAction } from "../actions/auth.actions";

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ 
  children, 
  initialUser = null 
}: { 
  children: React.ReactNode;
  initialUser?: UserDto | null;
}) => {
  const [user, setUser] = useState<UserDto | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialUser && JSON.stringify(initialUser) !== JSON.stringify(user)) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const logout = async () => {
    try {
      await logoutAction();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
