// src/app/api/tours/[id]/route.ts
import { NextResponse } from 'next/server';
import { tourCategories } from '@/lib/plant-data';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const tour = tourCategories.find(t => t.id === params.id);

        if (!tour) {
            return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
        }
        
        // Remove the icon component before sending over API
        const { icon, ...tourForApi } = tour;
        const responseData = {
          ...tourForApi,
          icon: icon ? (icon as any).name || (icon as any).displayName : undefined,
        }

        return NextResponse.json(responseData);

    } catch (e) {
        console.error(`Error fetching tour with id ${params.id}:`, e);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
