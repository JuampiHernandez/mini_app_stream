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
        version: "next",
        imageUrl: "https://mini-app-stream.vercel.app/talent_scg_long.svg",
        aspectRatio: "3:2",
        button: {
          title: "Check Builder Score",
          action: {
            type: "launch_frame",
            name: "Builder Score",
            url: "https://mini-app-stream.vercel.app",
            splashImageUrl: "https://mini-app-stream.vercel.app/talent_scg_long.svg"
          }
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
