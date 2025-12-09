import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    if (password === 'admin123') {
        (await cookies()).set('auth', 'true', { httpOnly: true, path: '/' });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
