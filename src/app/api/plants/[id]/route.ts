// src/app/api/plants/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Plant } from '@/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    if (!db.app) {
      return NextResponse.json({ message: 'Firebase is not configured correctly.', code: 'unconfigured' }, { status: 500 });
    }
  
    try {
        const plantRef = doc(db, 'plants', params.id);
        const plantSnap = await getDoc(plantRef);

        if (!plantSnap.exists()) {
            return NextResponse.json({ message: 'Plant not found', code: 'not-found' }, { status: 404 });
        }
        
        return NextResponse.json({ id: plantSnap.id, ...plantSnap.data() } as Plant);

    } catch (e: any) {
        const errorDetails = e instanceof Error ? e.message : String(e);
        console.error(`Error fetching plant with id ${params.id}:`, errorDetails);
        return NextResponse.json({ 
            message: `Internal Server Error: Could not fetch plant from database. Details: ${errorDetails}`, 
            code: e.code || 'unknown' 
        }, { status: 500 });
    }
}
