"use client";

import {
  useMiniKit,
  useAddFrame,
} from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";

interface TalentScore {
  score: {
    points: number;
    last_calculated_at: string;
  }
}

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFrame = useAddFrame();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    await addFrame();
  }, [addFrame]);

  const fetchBuilderScore = async (username: string) => {
    try {
      const response = await fetch(
        `https://api.talentprotocol.com/score?id=${username}&account_source=farcaster`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_TALENT_PROTOCOL_API_KEY || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch builder score');
      }

      const data: TalentScore = await response.json();
      return data.score.points;
    } catch (err) {
      throw new Error('Error fetching builder score');
    }
  };

  const handleCheckScore = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!context?.user?.username) {
        throw new Error('No Farcaster username found');
      }

      const builderScore = await fetchBuilderScore(context.user.username);
      setScore(builderScore);
    } catch (err) {
      setError((err as Error).message);
      setScore(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        {/* Header with profile info */}
        <header className="flex justify-between items-center mb-6 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {context?.user?.pfpUrl && (
              <div className="relative w-8 h-8">
                <Image
                  src={context.user.pfpUrl}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="32px"
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {context?.user?.displayName || context?.user?.username}
              </span>
              <span className="text-xs text-gray-400">
                @{context?.user?.username}
              </span>
            </div>
          </div>
          {context && !context.client.added && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFrame}
              className="text-[var(--app-accent)]"
            >
              Save Frame
            </Button>
          )}
        </header>

        <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          <h1 className="text-2xl font-bold text-center">Builder Score</h1>
          
          {score !== null ? (
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Your Score</h2>
              <div className="text-6xl font-bold text-[var(--app-accent)]">
                {score}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleCheckScore}
                className="bg-[var(--app-accent)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Score"}
              </Button>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          )}

          {/* Debug section for Farcaster context */}
          <div className="w-full mt-8 p-4 bg-gray-800 rounded-lg text-xs overflow-auto">
            <h3 className="text-sm font-semibold mb-2">Debug: Farcaster Context</h3>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(context, null, 2)}
            </pre>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <span className="text-[var(--ock-text-foreground-muted)] text-xs">
            Built with MiniKit
          </span>
        </footer>
      </div>
    </div>
  );
}
