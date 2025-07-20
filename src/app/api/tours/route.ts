// src/app/api/tours/route.ts
import { NextResponse } from 'next/server';
import { tourCategories } from '@/lib/plant-data';

export async function GET() {
  try {
    // We remove the actual Icon component before sending it over the API
    const toursForApi = tourCategories.map(({ icon, ...tour }) => ({
        ...tour,
        icon: icon ? (icon as any).name || (icon as any).displayName : undefined,
    }));
    return NextResponse.json(toursForApi);
  } catch (e) {
    console.error('Error fetching tours:', e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
