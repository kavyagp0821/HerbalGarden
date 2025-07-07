// src/app/api/plants/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db('herbal_garden');

        // Find one plant by its string ID, and exclude the internal _id field
        const plant = await db.collection('plants').findOne({ id: params.id }, { projection: { _id: 0 } });

        if (!plant) {
            return NextResponse.json({ message: 'Plant not found' }, { status: 404 });
        }
        
        return NextResponse.json(plant);

    } catch (e) {
        const errorDetails = e instanceof Error ? e.message : String(e);
        console.error(`Error fetching plant with id ${params.id}:`, errorDetails);
        return NextResponse.json({ message: `Internal Server Error: Could not fetch plant from database. Details: ${errorDetails}` }, { status: 500 });
    }
}
