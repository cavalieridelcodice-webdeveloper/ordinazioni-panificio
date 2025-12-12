import { NextResponse } from 'next/server';
import { db, Order } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await db.execute(
            'SELECT * FROM "Order" ORDER BY createdAt DESC'
        );

        const orders: Order[] = result.rows.map((row: any) => ({
            id: row.id as number,
            items: row.items as string,
            totalPrice: row.totalPrice as number,
            pickupTime: row.pickupTime as string,
            customerName: row.customerName as string,
            notes: row.notes as string | null,
            status: row.status as string,
            createdAt: row.createdAt as string,
        }));

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({
            error: 'Failed to fetch orders',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, pickupTime, notes, totalPrice, customerName } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        if (!pickupTime) {
            return NextResponse.json({ error: 'Pickup time is required' }, { status: 400 });
        }

        // Validate pickup time range (09:00 to 18:00)
        const [hours, minutes] = pickupTime.split(':').map(Number);
        if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
            return NextResponse.json({ error: 'Pickup time must be between 09:00 and 18:00' }, { status: 400 });
        }

        const result = await db.execute({
            sql: `INSERT INTO "Order" (items, pickupTime, notes, totalPrice, customerName, status, createdAt) 
                  VALUES (?, ?, ?, ?, ?, ?, datetime('now')) 
                  RETURNING *`,
            args: [
                JSON.stringify(items),
                pickupTime,
                notes || null,
                totalPrice,
                customerName || 'Cliente',
                'In attesa'
            ]
        });

        const order = result.rows[0];
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            error: 'Failed to create order',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
