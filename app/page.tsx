"use client";

import {
  useMiniKit,
  useAddFrame,
} from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import dynamic from "next/dynamic";
import { useWindowSize } from "react-use";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

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
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const addFrame = useAddFrame();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    if (score !== null) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [score]);

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
    } catch {
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
    <div className="flex flex-col min-h-screen font-sans bg-[#0A0A0A] text-white">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#A855F7', '#7C3AED', '#6D28D9', '#4C1D95']}
        />
      )}
      <div className="w-full max-w-md mx-auto px-4 py-6">
        {/* Header with profile info */}
        <header className="flex justify-between items-center mb-8 pb-3 border-b border-purple-800/30">
          <div className="flex items-center gap-3">
            {context?.user?.pfpUrl && (
              <div className="relative w-10 h-10 ring-2 ring-purple-500/20 rounded-full">
                <Image
                  src={context.user.pfpUrl}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-base">
                {context?.user?.displayName || context?.user?.username}
              </span>
              <span className="text-sm text-purple-300/60">
                @{context?.user?.username}
              </span>
            </div>
          </div>
          {context && !context.client.added && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFrame}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Save Frame
            </Button>
          )}
        </header>

        <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh] space-y-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Builder Score
          </h1>
          
          {score !== null ? (
            <div className="text-center animate-fade-in space-y-6">
              <h2 className="text-xl font-medium text-purple-300/90">Your Score</h2>
              <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {score}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <Button
                onClick={handleCheckScore}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Score"}
              </Button>
              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>
              )}
            </div>
          )}

          <div className="mt-12 w-48 opacity-70 hover:opacity-100 transition-opacity">
            <Image
              src="/talent_scg_long.svg"
              alt="Talent Protocol"
              width={192}
              height={29}
              priority
            />
          </div>
        </main>

        <footer className="mt-8 pt-4 flex justify-center">
          <span className="text-purple-300/40 text-xs">
            Built with MiniKit
          </span>
        </footer>
      </div>
    </div>
  );
}
