import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Webhook received:', body);

    // Return frame response
    return new Response(
      JSON.stringify({
        frames: [{
          image: "https://mini-app-stream.vercel.app/talent_scg_long.svg",
          version: "1",
          buttons: [{ label: "Check Score", action: "post" }],
        }],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid request'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
