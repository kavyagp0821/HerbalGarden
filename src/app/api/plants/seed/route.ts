
// src/app/api/plants/seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { initialPlants } from '@/lib/initial-plant-data';

export async function POST() {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        return NextResponse.json({ message: 'Firebase is not configured correctly.' }, { status: 500 });
    }

    try {
        const plantsCollection = collection(db, 'plants');
        const snapshot = await getDocs(plantsCollection);

        if (!snapshot.empty) {
            return NextResponse.json({ message: 'Database already contains plants. Seeding aborted.' }, { status: 400 });
        }

        const batch = writeBatch(db);
        let count = 0;

        initialPlants.forEach((plant) => {
            const docRef = doc(db, 'plants', plant.id);
            batch.set(docRef, plant);
            count++;
        });

        await batch.commit();

        return NextResponse.json({ message: `Successfully seeded ${count} plants into the database.` }, { status: 200 });

    } catch (e) {
        const errorDetails = e instanceof Error ? e.message : String(e);
        console.error('Error seeding Firestore:', e);
        return NextResponse.json({ message: `Internal Server Error: Could not seed database. Details: ${errorDetails}` }, { status: 500 });
    }
}
