export const AUTH_TOKEN_KEY = 'auth_token';

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return getCookie(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}