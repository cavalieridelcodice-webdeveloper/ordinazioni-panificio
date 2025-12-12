import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
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

        console.log('--- DEBUG: Pre-Prisma Create ---');
        console.log('TURSO_DATABASE_URL exists:', !!process.env.TURSO_DATABASE_URL);
        console.log('TURSO_AUTH_TOKEN exists:', !!process.env.TURSO_AUTH_TOKEN);
        console.log('Prisma instance available:', !!prisma);

        // Sanity check order data
        const orderData = {
            items: JSON.stringify(items),
            pickupTime,
            notes,
            totalPrice,
            customerName: customerName || 'Cliente',
            status: 'In attesa',
        };
        console.log('Order Data:', orderData);

        const order = await prisma.order.create({
            data: orderData,
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            error: 'Failed to create order',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
