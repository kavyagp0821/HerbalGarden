// src/app/api/plants/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { Plant } from '@/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('herbal_garden');
    
    // Find all plants, and exclude the internal _id field from the result
    const plants = await db.collection('plants').find({}, { projection: { _id: 0 } }).toArray();
    
    return NextResponse.json(plants);
  } catch (e) {
    console.error('Error fetching plants from MongoDB:', e);
    const errorDetails = e instanceof Error ? e.message : String(e);
    // Add a check for common connection issues.
    if (errorDetails.includes('querySrv ESERVFAIL') || errorDetails.includes('connect ETIMEDOUT')) {
        console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
        console.error('This error often means the server\'s IP address is not whitelisted in MongoDB Atlas.');
        console.error('To fix this, go to your Atlas dashboard > Network Access > Add IP Address and add `0.0.0.0/0` (Access from anywhere).');
        console.error('Also, double-check your MONGODB_URI in the .env file.');
        console.error('--- END HINT ---\n\n\n');
    }
    return NextResponse.json({ message: 'Internal Server Error: Could not fetch plants from database.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const plant: Plant = await request.json();
        
        // Basic validation
        if (!plant.id || !plant.commonName || !plant.latinName) {
            return NextResponse.json({ message: 'Missing required fields: id, commonName, and latinName are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("herbal_garden");
        const collection = db.collection("plants");
        
        // Check if a plant with this ID already exists to prevent duplicates
        const existingPlant = await collection.findOne({ id: plant.id });
        if (existingPlant) {
            return NextResponse.json({ message: `Plant with id '${plant.id}' already exists.` }, { status: 409 });
        }
        
        const result = await collection.insertOne(plant);
        
        return NextResponse.json({ message: "Plant stored successfully", insertedId: result.insertedId }, { status: 201 });

    } catch (err) {
        console.error('Error storing plant in MongoDB:', err);
        const errorDetails = err instanceof Error ? err.message : String(err);
        if (errorDetails.includes('querySrv ESERVFAIL') || errorDetails.includes('connect ETIMEDOUT')) {
            console.error('\n\n\n--- MONGO DB CONNECTION HINT ---');
            console.error('This error often means the server\'s IP address is not whitelisted in MongoDB Atlas.');
            console.error('To fix this, go to your Atlas dashboard > Network Access > Add IP Address and add `0.0.0.0/0` (Access from anywhere).');
            console.error('Also, double-check your MONGODB_URI in the .env file.');
            console.error('--- END HINT ---\n\n\n');
        }
        return NextResponse.json({ message: "Internal Server Error: Could not store plant in database" }, { status: 500 });
    }
}
