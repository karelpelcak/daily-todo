"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const response = await fetch('https://daily-todo-api.gryvdycz.workers.dev/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        console.log(response)

        if (!response.ok) {
            console.log('Login failed')
            const error = await response.json();
            throw new Error(error.message || 'Přihlášení se nezdařilo');
        }

        const data = await response.json();
        console.log('Login successful', data)
        setAuthToken(data.token);
        setIsAuthenticated(true);
        router.push('/');
    };

    const register = async (username: string, password: string) => {
        const response = await fetch('https://daily-todo-api.gryvdycz.workers.dev/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registrace se nezdařila');
        }

        const data = await response.json();
        setAuthToken(data.token);
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
