"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vyplň prosím všechna pole");
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            setError("Přihlášení se nezdařilo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md rounded-2xl shadow-md">
                <CardContent className="p-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Přihlášení
                    </h1>
                    <p className="text-center text-muted-foreground mb-6">
                        Přihlaš se do svého účtu
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                Uživatelské jméno
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Zadej své jméno"
                                className="w-full"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Heslo
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Zadej své heslo"
                                className="w-full"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Přihlašuji..." : "Přihlásit se"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Nemáš ještě účet?{" "}
                            <Link href="/register" className="font-medium hover:underline">
                                Registruj se
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
