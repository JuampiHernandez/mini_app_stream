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
    manifest: "/.well-known/miniapp-manifest.json",
    other: {
      "fc:frame": JSON.stringify({
        version: "1",
        image: `${URL}/talent_scg_long.svg`,
        buttons: [{ label: "Check Score", action: "post" }],
        post_url: `${URL}/api/webhook`,
        frames_url: URL,
        image_aspect_ratio: "1.91:1"
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
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
