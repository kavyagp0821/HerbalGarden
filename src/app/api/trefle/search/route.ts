// src/app/api/trefle/search/route.ts
import { NextResponse } from 'next/server';
import type { TreflePlant } from '@/types';

// This route can now handle both general listing and searching
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const token = process.env.TREFLE_API_KEY;

    if (!token) {
        return NextResponse.json({ message: 'Trefle API key is not configured.' }, { status: 500 });
    }

    let trefleUrl;
    if (query) {
        // Use the search endpoint if a query is provided
        trefleUrl = `https://trefle.io/api/v1/plants/search?token=${token}&q=${query}`;
    } else {
        // Use the list endpoint if no query is provided, fetching the first page
        trefleUrl = `https://trefle.io/api/v1/plants?token=${token}&page=1`;
    }

    try {
        const trefleResponse = await fetch(trefleUrl);

        if (!trefleResponse.ok) {
            const errorData = await trefleResponse.json();
            console.error('Trefle API responded with an error:', errorData);
            return NextResponse.json({ message: `Error from Trefle API: ${errorData.error || 'Unknown error'}` }, { status: trefleResponse.status });
        }

        const { data } = await trefleResponse.json();

        const formattedData: TreflePlant[] = data.map((plant: any) => ({
            id: plant.id,
            common_name: plant.common_name,
            scientific_name: plant.scientific_name,
            year: plant.year,
            image_url: plant.image_url,
            family: plant.family,
            genus: plant.genus,
            rank: plant.rank,
        }));
        
        return NextResponse.json(formattedData);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Internal server error while fetching from Trefle:', errorMessage);
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}
