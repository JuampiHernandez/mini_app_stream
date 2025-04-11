import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await req.json(); // We read the body but don't use it yet
    
    // Return a basic response for now
    return new Response(JSON.stringify({
      message: 'Webhook received'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return new Response(JSON.stringify({
      error: 'Invalid request'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
