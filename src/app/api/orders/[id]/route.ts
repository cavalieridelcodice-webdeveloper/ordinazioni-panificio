import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        // Build dynamic UPDATE query based on provided fields
        const updates: string[] = [];
        const args: any[] = [];

        if (body.status !== undefined) {
            updates.push('status = ?');
            args.push(body.status);
        }
        if (body.items !== undefined) {
            updates.push('items = ?');
            args.push(body.items);
        }
        if (body.customerName !== undefined) {
            updates.push('customerName = ?');
            args.push(body.customerName);
        }
        if (body.pickupTime !== undefined) {
            updates.push('pickupTime = ?');
            args.push(body.pickupTime);
        }
        if (body.notes !== undefined) {
            updates.push('notes = ?');
            args.push(body.notes);
        }
        if (body.totalPrice !== undefined) {
            updates.push('totalPrice = ?');
            args.push(body.totalPrice);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        args.push(id); // Add id for WHERE clause

        const result = await db.execute({
            sql: `UPDATE "Order" SET ${updates.join(', ')} WHERE id = ? RETURNING *`,
            args
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({
            error: 'Failed to update order',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        const result = await db.execute({
            sql: 'DELETE FROM "Order" WHERE id = ? RETURNING *',
            args: [id]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, deleted: result.rows[0] });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({
            error: 'Failed to delete order',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
