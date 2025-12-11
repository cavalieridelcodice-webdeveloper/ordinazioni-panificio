import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function main() {
    const sqlPath = path.join(process.cwd(), 'migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semi-colon to get individual statements? 
    // Turso might support executeMultiple but let's see. 
    // Usually migration files are multiple statements.
    // SQLite supports executing multiple statements in one go often?
    // standard @libsql/client might prefer executeMultiple.

    try {
        console.log('Executing migration...');
        await client.executeMultiple(sql);
        console.log('Migration completed successfully.');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

main();
