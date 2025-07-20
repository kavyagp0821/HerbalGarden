// src/app/api/plants/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, doc, setDoc } from 'firebase/firestore';
import type { Plant } from '@/types';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({ message: 'Firebase is not configured correctly.' }, { status: 500 });
  }

  try {
    const plantsCollection = collection(db, 'plants');
    const plantSnapshot = await getDocs(plantsCollection);
    const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
    
    // Sort plants alphabetically by common name
    plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));

    return NextResponse.json(plantsList);
  } catch (e) {
    const errorDetails = e instanceof Error ? e.message : String(e);
    console.error('Error fetching plants from Firestore:', errorDetails);
    return NextResponse.json({ message: `Internal Server Error: Could not fetch plants from database. Details: ${errorDetails}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return NextResponse.json({ message: 'Firebase is not configured correctly.' }, { status: 500 });
    }
    
    try {
        const plantData: Omit<Plant, 'id'> = await request.json();
        
        if (!plantData.commonName || !plantData.latinName) {
            return NextResponse.json({ message: 'Missing required fields: commonName and latinName are required.' }, { status: 400 });
        }
        
        // Generate a URL-friendly ID from the latin name
        const generatedId = plantData.latinName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        const plantDocRef = doc(db, 'plants', generatedId);

        // We explicitly set the document with the generated ID
        await setDoc(plantDocRef, plantData);
        
        return NextResponse.json({ message: "Plant stored successfully", id: generatedId }, { status: 201 });

    } catch (e) {
        const errorDetails = e instanceof Error ? e.message : String(e);
        console.error('Error storing plant in Firestore:', e);
        return NextResponse.json({ message: `Internal Server Error: Could not store plant in database. Details: ${errorDetails}` }, { status: 500 });
    }
}
