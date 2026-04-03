"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "@/features/auth/types";
import { authStore } from "@/features/auth/store/auth-store";
import apiClient from "@/shared/api/api-client";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const silentRefresh = async () => {
            try {
                const response = await apiClient.post("/auth/refresh", {});
                const { user, accessToken } = response.data.data;
                authStore.setToken(accessToken);
                setUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Silent refresh failed", error);
                authStore.clearToken();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        silentRefresh();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
