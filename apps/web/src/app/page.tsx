"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HUD } from "@/components/ui/HUD";
import { NegotiationChat } from "@/components/ui/NegotiationChat";
import { BahiKhata } from "@/components/ui/BahiKhata";
import { useGameStore } from "@/store/gameStore";

// Dynamic import for Three.js scene (SSR safe)
const GarageScene = dynamic(() => import("@/components/three/GarageScene").then((mod) => mod.GarageScene), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-loha-900 z-10">
      <div className="text-center">
        <div className="text-4xl font-heading text-kabaad-500 mb-4">कबाड़ से करोड़पति</div>
        <div className="text-kabaad-300">Loading garage...</div>
        <div className="mt-6 w-48 mx-auto h-2 bg-loha-700 rounded-full overflow-hidden">
          <div className="h-full bg-kabaad-500 animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  ),
});

export default function GamePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { initializeGame, gameState } = useGameStore();

  useEffect(() => {
    initializeGame();
    setIsLoaded(true);
  }, [initializeGame]);

  if (!isLoaded) return null;

  const showHUD = gameState.player.progressionStage !== "BORI_MAN" && gameState.player.progressionStage !== "THELA_WALA";

  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas */}
      <GarageScene />

      {/* UI Overlay */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Top HUD */}
        {showHUD && <HUD className="pointer-events-auto" />}

        {/* Bottom Center - Negotiation Chat (when active) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-30 md:bottom-24">
          <NegotiationChat />
        </div>

        {/* Right Side - Bahi Khata (Ledger) */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 pointer-events-auto z-20 hidden lg:block">
          <BahiKhata />
        </div>

        {/* Mobile Touch Controls */}
        <div className="fixed bottom-6 left-6 z-50 touch-control left lg:hidden">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <button className="w-12 h-12 rounded-full flex items-center justify-center text-loha-700 active:bg-loha-100">
              ↺
            </button>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 touch-control right lg:hidden">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <button className="w-12 h-12 rounded-full flex items-center justify-center text-loha-700 active:bg-loha-100">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Stage Indicator Toast */}
      <StageToast />
    </div>
  );
}

// Stage progression toast component
function StageToast() {
  const { gameState, dismissStageToast } = useGameStore();
  const [showToast, setShowToast] = useState(false);
  const [toastStage, setToastStage] = useState("");

  useEffect(() => {
    if (gameState.unlockedFeatures.includes("stage_toast_" + gameState.player.progressionStage)) {
      return;
    }
    setToastStage(gameState.player.progressionStage);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      dismissStageToast(gameState.player.progressionStage);
    }, 5000);
    return () => clearTimeout(timer);
  }, [gameState.player.progressionStage, dismissStageToast]);

  if (!showToast) return null;

  const stageNames: Record<string, string> = {
    BORI_MAN: "बोरी-मैन (Footpath Collector)",
    THELA_WALA: "ठेला-वाला (Mobile Trader)",
    GALLI_GARAGE: "गली गैराज (First Garage)",
    DEALERSHIP: "डीलरशिप (Showroom)",
    INDUSTRIAL_YARD: "इंडस्ट्रियल यार्ड (Dismantling Hub)",
    TYCOON: "टाइकून (Automotive Empire)",
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-slide-down">
      <div className="bg-kabaad-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4">
        <div className="text-3xl">🎉</div>
        <div>
          <div className="text-sm text-kabaad-100">STAGE UNLOCKED</div>
          <div className="text-xl font-heading">{stageNames[toastStage] || toastStage}</div>
        </div>
      </div>
    </div>
  );
}