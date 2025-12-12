import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
    try {
        // Remove quotes if the user accidentally pasted them in Vercel
        const rawUrl = process.env.TURSO_DATABASE_URL;
        const url = rawUrl?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        const authToken = process.env.TURSO_AUTH_TOKEN?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

        console.log('Initializing Prisma Client with adapter');
        // Check for "undefined" string specifically
        if (url === 'undefined') {
            console.error('CRITICAL: TURSO_DATABASE_URL is the literal string "undefined". Check your .env file.');
            throw new Error('TURSO_DATABASE_URL is "undefined" string');
        }

        if (!url) {
            throw new Error(`TURSO_DATABASE_URL is missing. Raw: ${rawUrl}`);
        }

        // Validate URL format before passing to createClient
        try {
            new URL(url);
            console.log('Valid URL verified:', url.replace(/:[^:]*@/, ':***@'));
        } catch (e) {
            console.error(`Invalid URL format for TURSO_DATABASE_URL: '${url}'`);
            throw new Error(`Invalid TURSO_DATABASE_URL format: ${e instanceof Error ? e.message : String(e)}`);
        }

        const libsql = createClient({
            url,
            authToken: authToken,
        })
        const adapter = new PrismaLibSql(libsql as any)
        return new PrismaClient({ adapter })
    } catch (error) {
        console.error('Failed to initialize Prisma Client:', error);
        throw error;
    }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
