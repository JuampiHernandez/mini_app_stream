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
            {context?.client && (
              <div className="text-sm text-[var(--app-accent)]">
                <Identity className="text-sm">
                  Connected
                </Identity>
              </div>
            )}
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

        <main className="flex-1 flex flex-col items-center justify-center space-y-8 py-12">
          <Button
            onClick={handleCheckScore}
            className="bg-[var(--app-accent)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Score"}
          </Button>

          {score !== null && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Your Builder Score</h2>
              <div className="text-4xl font-bold text-[var(--app-accent)]">
                {score}
              </div>
            </div>
          )}
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
