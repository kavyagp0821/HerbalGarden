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

        if (errorDetails.includes('querySrv ENOTFOUND') || errorDetails.includes('querySrv ESERVFAIL')) {
            console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
            console.error('This error means your MONGODB_URI is likely incorrect or incomplete.');
            console.error('Specifically, the cluster address (e.g., cluster0.xxxxx.mongodb.net) could not be found.');
            console.error('ACTION: Please double-check the MONGODB_URI in your .env file. Copy it directly from your MongoDB Atlas dashboard under "Connect" > "Drivers".');
            console.error('--- END HINT ---\n\n\n');
            return NextResponse.json({ message: `Database connection failed: The cluster address in your MONGODB_URI seems incorrect. Please verify it in your .env file.` }, { status: 500 });
        }

        if (errorDetails.includes('connect ETIMEDOUT')) {
            console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
            console.error('This error often means the server\'s IP address is not whitelisted in MongoDB Atlas.');
            console.error('To fix this, go to your Atlas dashboard > Network Access > Add IP Address and add `0.0.0.0/0` (Access from anywhere).');
            console.error('--- END HINT ---\n\n\n');
        } else if (errorDetails.toLowerCase().includes('authentication failed')) {
            console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
            console.error('MongoDB authentication failed. This usually means the username or password in your MONGODB_URI is incorrect.');
            console.error('Please double-check your credentials in the .env file. Ensure you have replaced `<password>` with your actual database user password.');
            console.error('--- END HINT ---\n\n\n');
        }

        return NextResponse.json({ message: `Internal Server Error: Could not fetch plant from database. Details: ${errorDetails}` }, { status: 500 });
    }
}
