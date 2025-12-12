import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('--- TEST DB ROUTE ---');
    try {
        const rawUrl = process.env.TURSO_DATABASE_URL;
        const rawToken = process.env.TURSO_AUTH_TOKEN;

        console.log('Raw URL exists:', !!rawUrl);
        console.log('Raw Token exists:', !!rawToken);

        const url = rawUrl?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        const authToken = rawToken?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

        if (!url || !authToken) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
        }

        const client = createClient({
            url,
            authToken,
        });

        const rs = await client.execute('SELECT 1 as val');
        return NextResponse.json({ success: true, result: rs });
    } catch (e) {
        console.error('Test DB Failed:', e);
        return NextResponse.json({
            error: 'Test DB Failed',
            details: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : undefined
        }, { status: 500 });
    }
}
