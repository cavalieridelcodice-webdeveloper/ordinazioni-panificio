import { createClient } from '@libsql/client';

// Initialize LibSQL client
const rawUrl = process.env.TURSO_DATABASE_URL;
const rawToken = process.env.TURSO_AUTH_TOKEN;

if (!rawUrl || !rawToken) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
}

// Clean credentials (remove quotes if present)
const url = rawUrl.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
const authToken = rawToken.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

// Create and export client
export const db = createClient({
    url,
    authToken,
});

// Type definitions for Order
export interface Order {
    id: number;
    items: string;
    totalPrice: number;
    pickupTime: string;
    customerName: string;
    notes: string | null;
    status: string;
    createdAt: string;
}
