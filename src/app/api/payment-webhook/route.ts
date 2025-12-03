// src/app/api/payment-webhook/route.ts
import { NextResponse } from 'next/server';

// This webhook is disabled as it relies on the Firebase Admin SDK.

export async function POST(request: Request) {
    console.error("Payment webhook is disabled because the Firebase Admin SDK has been removed.");
    return NextResponse.json({ error: 'This service is currently unavailable.' }, { status: 503 });
}
