"use client";

import { useGameStore } from "@/store/gameStore";
import { Coin, Truck, Wrench, Gauge, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";

export function HUD() {
  const { gameState, scrapRates } = useGameStore();
  const stageData = PROGRESSION_STAGES.find((s) => s.id === gameState.player.progressionStage);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "RISING": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "FALLING": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-kabaad-400" />;
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-30 pointer-events-none">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mx-auto max-w-7xl pointer-events-auto">
        {/* Left: Stage & Day */}
        <div className="desi-panel flex items-center gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-kabaad-100 flex items-center justify-center">
              <span className="text-kabaad-600 font-heading text-lg">{STAGE_ICONS[gameState.player.progressionStage]}</span>
            </div>
            <div>
              <div className="font-heading text-xl text-loha-900">{stageData?.name || gameState.player.progressionStage}</div>
              <div className="text-xs text-kabaad-500 hindi-text">{stageData?.nameHindi}</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 ml-4 border-l border-kabaad-200 pl-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-kabaad-500">Day</span>
              <span className="font-mono font-bold text-loha-900">{gameState.currentDay}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-kabaad-500">Year</span>
              <span className="font-mono font-bold text-loha-900">{gameState.currentYear}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-kabaad-500">Stage Progress</span>
              <div className="w-32 h-2 bg-kabaad-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-kabaad-500 transition-all duration-500"
                  style={{ width: `${getStageProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Cash & Assets */}
        <div className="desi-panel flex items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2">
            <Coin className="w-6 h-6 text-kabaad-500" />
            <div>
              <div className="text-xs text-kabaad-500 uppercase tracking-wide">Cash in Hand</div>
              <div className="font-heading text-2xl font-bold text-loha-900 font-mono">
                ₹{gameState.player.cash.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-kabaad-200" />
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-500" />
            <div>
              <div className="text-xs text-kabaad-500 uppercase tracking-wide">Total Assets</div>
              <div className="font-heading text-2xl font-bold text-blue-600 font-mono">
                ₹{gameState.player.totalAssets.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-kabaad-200" />
          <div className="flex items-center gap-2">
            <Gauge className="w-6 h-6 text-orange-500" />
            <div>
              <div className="text-xs text-kabaad-500 uppercase tracking-wide">Raid Risk</div>
              <div className="font-heading text-2xl font-bold text-orange-600 font-mono">
                {gameState.player.raidRiskMeter.toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-kabaad-200" />
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-purple-500" />
            <div>
              <div className="text-xs text-kabaad-500 uppercase tracking-wide">Reputation</div>
              <div className="font-heading text-2xl font-bold text-purple-600 font-mono">
                {gameState.player.reputation >= 0 ? "+" : ""}{gameState.player.reputation}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Scrap Rates */}
        <div className="desi-panel hidden lg:block">
          <div className="font-heading text-sm text-loha-900 mb-2 flex items-center gap-2">
            Live Rates / लाइव रेट
            <span className="text-xs text-kabaad-500">(₹/kg)</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {["LOHA", "TAAMBA", "ALUMINIUM", "BATTERY"].map((mat) => {
              const rate = scrapRates.find((r) => r.material === mat);
              if (!rate) return null;
              return (
                <div key={mat} className="flex flex-col items-center gap-1 p-2 bg-kabaad-50 rounded-lg">
                  <div className="font-medium text-loha-900">{MATERIAL_SHORT[mat]}</div>
                  <div className="font-mono font-bold text-kabaad-600">₹{rate.currentRate}</div>
                  <div className="flex items-center gap-1">{getTrendIcon(rate.trend)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Events Bar */}
      {gameState.activeEvents.length > 0 && (
        <div className="mx-auto max-w-7xl mt-3 pointer-events-auto">
          <div className="desi-panel overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max">
              <AlertTriangle className="w-5 h-5 text-kabaad-500 flex-shrink-0" />
              <span className="font-medium text-loha-900 whitespace-nowrap">Active Events:</span>
              {gameState.activeEvents.map((event) => (
                <span
                  key={event}
                  className="px-3 py-1 bg-kabaad-100 text-kabaad-700 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {EVENT_LABELS[event]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Scrap Rates Dropdown */}
      <div className="lg:hidden mx-auto max-w-7xl mt-3 pointer-events-auto">
        <ScrapRatesMobile rates={scrapRates} />
      </div>
    </div>
  );
}

function ScrapRatesMobile({ rates }: { rates: typeof gameState.scrapRates }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="desi-panel">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2"
      >
        <span className="font-medium text-loha-900">Live Scrap Rates / स्क्रैप रेट</span>
        <span className="text-kabaad-500">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-kabaad-200">
          {["LOHA", "TAAMBA", "ALUMINIUM", "BATTERY", "PLASTIC", "TYRE", "EWASTE"].map((mat) => {
            const rate = rates.find((r) => r.material === mat);
            if (!rate) return null;
            return (
              <div key={mat} className="flex flex-col items-center gap-1 p-2 bg-kabaad-50 rounded-lg">
                <div className="font-medium text-loha-900 text-xs">{MATERIAL_SHORT[mat]}</div>
                <div className="font-mono font-bold text-kabaad-600 text-sm">₹{rate.currentRate}</div>
                <div className="flex items-center gap-1 text-xs">{getTrendIcon(rate.trend)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

const STAGE_ICONS: Record<string, string> = {
  BORI_MAN: "🎒",
  THELA_WALA: "🛒",
  GALLI_GARAGE: "🔧",
  DEALERSHIP: "🏪",
  INDUSTRIAL_YARD: "🏭",
  TYCOON: "👑",
};

const MATERIAL_SHORT: Record<string, string> = {
  LOHA: "लोहा",
  TAAMBA: "तांबा",
  ALUMINIUM: "एल्यु",
  BATTERY: "बैटरी",
  PLASTIC: "प्लास्टिक",
  TYRE: "टायर",
  EWASTE: "ई-वेस्ट",
};

const EVENT_LABELS: Record<string, string> = {
  MONSOON: "🌧️ Monsoon Fury",
  SHAADI_SEASON: "💍 Shaadi Season",
  DIWALI_DHANTERAS: "🪔 Diwali Rush",
  HIGHWAY_STRIKE: "🚛 Highway Strike",
};

function getStageProgress(): number {
  const { gameState } = useGameStore.getState();
  const { PROGRESSION_STAGES, checkProgressionRequirements } = require("@kabaad/shared/progression");
  const current = PROGRESSION_STAGES.find((s: any) => s.id === gameState.player.progressionStage);
  const next = PROGRESSION_STAGES[PROGRESSION_STAGES.findIndex((s: any) => s.id === gameState.player.progressionStage) + 1];
  if (!current || !next) return 100;
  const assetProgress = Math.min(100, (gameState.player.totalAssets / next.requiredAssets) * 100);
  const repProgress = Math.min(100, (gameState.player.reputation / next.requiredReputation) * 100);
  return Math.min(assetProgress, repProgress);
}