import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    console.log('Initializing Prisma Client with adapter');
    console.log('TURSO_DATABASE_URL present:', !!url);
    console.log('TURSO_AUTH_TOKEN present:', !!authToken);

    const libsql = createClient({
        url: url!,
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
