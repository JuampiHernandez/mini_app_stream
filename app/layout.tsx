import './theme.css';
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://mini-app-stream.vercel.app";
  
  return {
    title: "Builder Score",
    description: "Check your Talent Protocol Builder Score on Farcaster",
    manifest: "/.well-known/farcaster.json",
    other: {
      "fc:frame": JSON.stringify({
        version: "1",
        image: `${URL}/talent_scg_long.svg`,
        buttons: [{ label: "Check Score", action: "post" }],
        post_url: `${URL}/api/webhook`,
        frames_url: URL,
        splash_screen: {
          image_url: `${URL}/talent_scg_long.svg`,
          background_color: "#0A0A0A"
        }
      })
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="of:accepts:xmtp" content="true" />
        <meta property="of:version" content="1" />
        <meta property="of:name" content="Builder Score" />
        <meta property="of:description" content="Check your Talent Protocol Builder Score on Farcaster" />
      </head>
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
