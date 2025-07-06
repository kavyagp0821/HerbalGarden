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
        console.error(`Error fetching plant with id ${params.id}:`, e);
        const errorDetails = e instanceof Error ? e.message : String(e);
        if (errorDetails.includes('querySrv ESERVFAIL') || errorDetails.includes('connect ETIMEDOUT')) {
            console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
            console.error('This error often means the server\'s IP address is not whitelisted in MongoDB Atlas.');
            console.error('To fix this, go to your Atlas dashboard > Network Access > Add IP Address and add `0.0.0.0/0` (Access from anywhere).');
            console.error('Also, double-check your MONGODB_URI in the .env file.');
            console.error('--- END HINT ---\n\n\n');
        }
        return NextResponse.json({ message: 'Internal Server Error: Could not fetch plant from database.' }, { status: 500 });
    }
}
