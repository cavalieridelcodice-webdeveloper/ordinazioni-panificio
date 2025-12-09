import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();
        const { status } = body;

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
