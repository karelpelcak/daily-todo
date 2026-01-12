import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Veřejné cesty, které nevyžadují autentizaci
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    // Pokud uživatel není přihlášen a jde na chráněnou stránku
    if (!authToken && !isPublicPath) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Pokud je uživatel přihlášen a jde na login/register, přesměruj na hlavní stránku
    if (authToken && isPublicPath) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
