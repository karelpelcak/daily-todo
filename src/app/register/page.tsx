"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Vyplň prosím všechna pole");
            return;
        }

        if (password !== confirmPassword) {
            setError("Hesla se neshodují");
            return;
        }

        if (password.length < 6) {
            setError("Heslo musí mít alespoň 6 znaků");
            return;
        }

        setIsLoading(true);
        try {
            await register(username, password);
        } catch (err) {
            setError("Registrace se nezdařila");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md rounded-2xl shadow-md">
                <CardContent className="p-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Registrace
                    </h1>
                    <p className="text-center text-muted-foreground mb-6">
                        Vytvoř si nový účet
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                Potvrzení hesla
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Zadej heslo znovu"
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
                            {isLoading ? "Registruji..." : "Registrovat se"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Už máš účet?{" "}
                            <Link href="/login" className="font-medium hover:underline">
                                Přihlas se
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
