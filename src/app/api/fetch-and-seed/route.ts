// src/app/api/fetch-and-seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import type { Plant } from '@/types';

// A simple in-memory flag to prevent multiple seeding operations during the same server instance lifecycle.
let isSeeding = false;

// List of specific medicinal plants to search for in Trefle
const plantsToFetch = ['tulsi', 'brahmi', 'turmeric', 'ashwagandha', 'neem', 'amla', 'giloy', 'moringa'];

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
    console.log("Starting to fetch specific plant data from Trefle API...");
    const batch = writeBatch(db);
    const plantsCollection = collection(db, 'plants');
    let plantsAddedCount = 0;

    for (const plantName of plantsToFetch) {
      // Check if a plant with a similar common name already exists to avoid duplicates
      const q = query(plantsCollection, where("commonName", "==", plantName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log(`Plant '${plantName}' already exists in Firestore. Skipping.`);
        continue;
      }
      
      console.log(`Fetching data for: ${plantName}`);
      const response = await fetch(`https://trefle.io/api/v1/plants/search?token=${TREFLE_API_TOKEN}&q=${plantName}`);
      if (!response.ok) {
        console.warn(`Trefle API responded with status: ${response.status} for plant: ${plantName}. Skipping.`);
        continue;
      }
    
      const data = await response.json();
      // Use the first result as it's often the most relevant
      const treflePlant = data.data?.[0];

      if (!treflePlant || !treflePlant.common_name) {
        console.warn(`No relevant plant data found on Trefle for '${plantName}'.`);
        continue;
      }

      console.log(`Found '${treflePlant.common_name}'. Preparing to add to Firestore.`);
      
      const docRef = doc(plantsCollection);
      
      const newPlant: Omit<Plant, 'id'> = {
        commonName: treflePlant.common_name,
        latinName: treflePlant.scientific_name,
        description: `Data for ${treflePlant.common_name} fetched from Trefle. More details can be added here.`,
        therapeuticUses: ['Medicinal'], // Default category
        region: treflePlant.distribution?.native?.join(', ') || 'Various regions',
        classification: `${treflePlant.family_common_name || 'N/A'} / ${treflePlant.genus || 'N/A'}`,
        imageSrc: treflePlant.image_url || `https://placehold.co/600x400.png`,
        imageHint: treflePlant.common_name,
        ayushUses: 'Known for general medicinal properties as per Trefle data.',
        source: 'Trefle',
        sourceId: treflePlant.id.toString(),
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      batch.set(docRef, { ...newPlant, id: docRef.id });
      plantsAddedCount++;
    }

    if (plantsAddedCount > 0) {
        await batch.commit();
        console.log(`Successfully stored ${plantsAddedCount} new plants in Firestore.`);
    }

    isSeeding = false;
    return NextResponse.json({ message: `Seeding complete. Added ${plantsAddedCount} new medicinal plants from Trefle to Firestore.` }, { status: 200 });

  } catch (error) {
    isSeeding = false;
    console.error('Error fetching or storing data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to fetch or store data: ${errorMessage}` }, { status: 500 });
  }
}
