"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (isLoading) return;

        const publicPaths = ["/login", "/register"];
        const isPublicPath = publicPaths.includes(pathname);

        // Pokud uživatel není přihlášen a jde na chráněnou stránku
        if (!isAuthenticated && !isPublicPath) {
            router.push("/login");
            return;
        }

        // Pokud je uživatel přihlášen a jde na login/register, přesměruj na hlavní stránku
        if (isAuthenticated && isPublicPath) {
            router.push("/");
            return;
        }

        setIsChecking(false);
    }, [isAuthenticated, isLoading, pathname, router]);

    // Zobrazit loader při kontrole
    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted">
                <p>Načítám...</p>
            </div>
        );
    }

    return <>{children}</>;
}
