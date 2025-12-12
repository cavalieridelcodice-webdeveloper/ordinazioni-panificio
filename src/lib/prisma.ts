import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
    // Remove quotes if the user accidentally pasted them in Vercel
    const rawUrl = process.env.TURSO_DATABASE_URL;
    const url = rawUrl?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    const authToken = process.env.TURSO_AUTH_TOKEN?.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

    console.log('Initializing Prisma Client with adapter');
    console.log('TURSO_DATABASE_URL type:', typeof rawUrl);
    console.log('TURSO_DATABASE_URL length:', rawUrl?.length);
    console.log('TURSO_DATABASE_URL (masked):', url ? `${url.substring(0, 15)}...` : 'undefined');
    console.log('TURSO_AUTH_TOKEN present:', !!authToken);

    if (!url) {
        throw new Error(`TURSO_DATABASE_URL is missing. Raw: ${rawUrl}`);
    }

    const libsql = createClient({
        url,
        authToken: authToken,
    })
    const adapter = new PrismaLibSql(libsql as any)
    return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
