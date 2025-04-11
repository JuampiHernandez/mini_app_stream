"use client";

import {
  useMiniKit,
  useAddFrame,
} from "@coinbase/onchainkit/minikit";
import { Identity } from "@coinbase/onchainkit/identity";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const addFrame = useAddFrame();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    await addFrame();
  }, [addFrame]);

  const handleCheckScore = async () => {
    setLoading(true);
    // TODO: Implement Talent Protocol API call here
    setTimeout(() => {
      setScore(85); // Placeholder score for now
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Builder Score Checker</h1>
          </div>
          <div className="flex items-center gap-4">
            {context?.client && (
              <div className="text-sm text-[var(--app-accent)]">
                <Identity className="text-sm">
                  Connected User
                </Identity>
              </div>
            )}
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
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          {score !== null ? (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">Your Builder Score</h2>
              <div className="text-6xl font-bold text-[var(--app-accent)]">
                {score}
              </div>
            </div>
          ) : (
            <Button
              onClick={handleCheckScore}
              className="bg-[var(--app-accent)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Score"}
            </Button>
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
