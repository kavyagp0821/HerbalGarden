// src/app/api/plants/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Plant } from '@/types';

export async function GET() {
  if (!db.app) {
    return NextResponse.json({ message: 'Firebase is not configured correctly.', code: 'unconfigured' }, { status: 500 });
  }

  try {
    const plantsCollection = collection(db, 'plants');
    const plantSnapshot = await getDocs(plantsCollection);
    const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
    
    // Sort plants alphabetically by common name
    plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));

    return NextResponse.json(plantsList);
  } catch (e: any) {
    const errorDetails = e instanceof Error ? e.message : String(e);
    console.error('Error fetching plants from Firestore:', errorDetails);
    return NextResponse.json({ 
        message: `Internal Server Error: Could not fetch plants from database. Details: ${errorDetails}`,
        code: e.code || 'unknown'
    }, { status: 500 });
  }
}
