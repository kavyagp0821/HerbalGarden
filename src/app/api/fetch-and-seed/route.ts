// src/app/api/fetch-and-seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import type { Plant } from '@/types';

// A simple in-memory flag to prevent multiple seeding operations during the same server instance lifecycle.
let isSeeding = false;

export async function GET() {
  if (isSeeding) {
    return NextResponse.json({ message: 'Seeding process is already in progress.' }, { status: 409 });
  }

  isSeeding = true;
  const TREFLE_API_TOKEN = process.env.TREFLE_API_TOKEN;

  if (!TREFLE_API_TOKEN) {
    isSeeding = false;
    return NextResponse.json({ error: 'Trefle API token is not configured. Please set TREFLE_API_TOKEN in your .env file.' }, { status: 500 });
  }

  try {
    console.log("Starting to fetch data from Trefle API...");
    // Use the search endpoint to find plants with "medicinal" properties or uses.
    const response = await fetch(`https://trefle.io/api/v1/plants/search?token=$NQ_c4MJJ1_CsjsCYU3USJrxmfXKDUUF69rg6dIEZy0I&q=medicinal&limit=20`);
    if (!response.ok) {
        throw new Error(`Trefle API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    const treflePlants = data.data;

    if (!treflePlants || treflePlants.length === 0) {
      isSeeding = false;
      return NextResponse.json({ message: 'No medicinal plants found on Trefle to seed.' }, { status: 200 });
    }
    console.log(`Found ${treflePlants.length} plants from Trefle. Storing in Firestore...`);


    const batch = writeBatch(db);
    const plantsCollection = collection(db, 'plants');

    for (const plant of treflePlants) {
      if (!plant.common_name) {
        // Skip plants without a common name to ensure data quality
        continue;
      }
      // Let Firestore generate a new unique ID for the document
      const docRef = doc(plantsCollection);
      
      const newPlant: Omit<Plant, 'id'> & { id: string } = {
        id: docRef.id, // Set the ID field within the document itself
        commonName: plant.common_name,
        latinName: plant.scientific_name,
        description: `Data for ${plant.common_name} fetched from Trefle. More details can be added here.`,
        therapeuticUses: ['Medicinal'], // Default category since we searched for it
        region: plant.distribution?.native?.join(', ') || 'Various regions',
        classification: `${plant.family_common_name || 'N/A'} / ${plant.genus || 'N/A'}`,
        imageSrc: plant.image_url || `https://placehold.co/600x400.png`,
        imageHint: plant.common_name,
        ayushUses: 'Known for general medicinal properties as per Trefle data.',
        source: 'Trefle',
        sourceId: plant.id.toString(),
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      batch.set(docRef, newPlant);
    }

    await batch.commit();

    isSeeding = false;
    return NextResponse.json({ message: `Successfully stored ${treflePlants.length} medicinal plants from Trefle in Firestore.` }, { status: 200 });

  } catch (error) {
    isSeeding = false;
    console.error('Error fetching or storing data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to fetch or store data: ${errorMessage}` }, { status: 500 });
  }
}
