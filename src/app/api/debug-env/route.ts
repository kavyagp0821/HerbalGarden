// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;

  return NextResponse.json({
    message: "This route is for debugging environment variables on the server.",
    MONGODB_URI_from_server_env: mongoUri || "--- MONGODB_URI IS NOT SET OR EMPTY ---",
    hasMongoUri: !!mongoUri,
  });
}
