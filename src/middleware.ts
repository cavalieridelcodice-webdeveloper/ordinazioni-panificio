import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/staff/dashboard')) {
        const auth = request.cookies.get('auth');
        if (!auth) {
            if (!request.url) {
                console.error('Middleware: request.url is undefined');
                return NextResponse.redirect(new URL('/staff/login', 'http://localhost:3000')); // Fallback
            }
            return NextResponse.redirect(new URL('/staff/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/staff/dashboard/:path*',
};
