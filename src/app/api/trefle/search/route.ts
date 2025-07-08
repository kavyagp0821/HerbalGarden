
import { NextResponse } from 'next/server';

// This API route is not in use.
export async function GET(request: Request) {
    return NextResponse.json({ message: 'This feature is not enabled.' }, { status: 404 });
}
