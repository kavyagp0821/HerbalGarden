// src/app/api/plants/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import type { Plant } from '@/types';

export async function GET() {
  try {
    const plantsCollection = collection(db, 'plants');
    const plantSnapshot = await getDocs(plantsCollection);
    const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
    
    return NextResponse.json(plantsList);
  } catch (e) {
    const errorDetails = e instanceof Error ? e.message : String(e);
    console.error('Error fetching plants from Firestore:', errorDetails);
    return NextResponse.json({ message: `Internal Server Error: Could not fetch plants from database. Details: ${errorDetails}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const plantData: Omit<Plant, 'id'> = await request.json();
        
        // Basic validation
        if (!plantData.commonName || !plantData.latinName) {
            return NextResponse.json({ message: 'Missing required fields: commonName and latinName are required.' }, { status: 400 });
        }

        const plantsCollection = collection(db, "plants");
        
        // To prevent duplicates, we can generate a consistent ID from the latin name
        const generatedId = plantData.latinName.toLowerCase().replace(/ /g, '-');
        
        const q = query(plantsCollection, where("id", "==", generatedId));
        const existingPlantSnapshot = await getDocs(q);

        if (!existingPlantSnapshot.empty) {
            return NextResponse.json({ message: `Plant with id '${generatedId}' already exists.` }, { status: 409 });
        }
        
        // Add the new plant to the collection
        const docRef = await addDoc(plantsCollection, {
            ...plantData,
            id: generatedId // Storing the generated ID in the document as well
        });
        
        return NextResponse.json({ message: "Plant stored successfully", documentId: docRef.id }, { status: 201 });

    } catch (e) {
        const errorDetails = e instanceof Error ? e.message : String(e);
        console.error('Error storing plant in Firestore:', e);
        return NextResponse.json({ message: `Internal Server Error: Could not store plant in database. Details: ${errorDetails}` }, { status: 500 });
    }
}
