
// src/app/api/plants/route.ts
import { NextResponse } from 'next/server';
import { plantService } from '@/services/plant.service';

export async function GET() {
  try {
    const plantsList = await plantService.getPlants();
    
    return NextResponse.json(plantsList);
  } catch (e: any) {
    const errorDetails = e instanceof Error ? e.message : String(e);
    console.error('Error fetching plants from service:', errorDetails);
    return NextResponse.json({ 
        message: `Internal Server Error: Could not fetch plants. Details: ${errorDetails}`,
        code: e.code || 'unknown'
    }, { status: 500 });
  }
}
