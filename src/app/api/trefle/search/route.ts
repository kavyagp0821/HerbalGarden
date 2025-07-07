// src/app/api/trefle/search/route.ts
import { NextResponse } from 'next/server';
import { trefleService } from '@/services/trefle.service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ message: 'Search query parameter "q" is required.' }, { status: 400 });
    }

    try {
        const results = await trefleService.search(query);
        return NextResponse.json(results);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('Trefle search API route error:', errorMessage);
        return NextResponse.json({ message: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}
