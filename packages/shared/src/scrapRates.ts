import { Material, ScrapRate } from "./types";

// ============================================
// SCRAP MARKET RATES - From PRD
// ============================================

export const BASE_SCRAP_RATES: Record<Material, Omit<ScrapRate, "currentRate" | "trend" | "lastUpdated">> = {
  LOHA: {
    material: "LOHA",
    baseRate: 38,
    minRate: 28,
    maxRate: 52,
  },
  TAAMBA: {
    material: "TAAMBA",
    baseRate: 620,
    minRate: 510,
    maxRate: 850,
  },
  ALUMINIUM: {
    material: "ALUMINIUM",
    baseRate: 180,
    minRate: 140,
    maxRate: 240,
  },
  BATTERY: {
    material: "BATTERY",
    baseRate: 95,
    minRate: 75,
    maxRate: 135,
  },
  PLASTIC: {
    material: "PLASTIC",
    baseRate: 14,
    minRate: 8,
    maxRate: 24,
  },
  TYRE: {
    material: "TYRE",
    baseRate: 18,
    minRate: 10,
    maxRate: 28,
  },
  EWASTE: {
    material: "EWASTE",
    baseRate: 320,
    minRate: 220,
    maxRate: 500,
  },
};

export const MATERIAL_DISPLAY_NAMES: Record<Material, string> = {
  LOHA: "लोहा (Heavy Iron/Steel)",
  TAAMBA: "तांबा (Copper Wire/Radiators)",
  ALUMINIUM: "एल्युमिनियम (Alloys & Engine Blocks)",
  BATTERY: "पुरानी बैटरी (Lead Acid)",
  PLASTIC: "प्लास्टिक & फाइबर ग्लास",
  TYRE: "पुराना टायर (Rubber Scrap)",
  EWASTE: "ई-वेस्ट (ECUs, Sensors, Wiring)",
};

export const MATERIAL_MARKET_DRIVERS: Record<Material, string> = {
  LOHA: "Infrastructure construction, scrap policy bans",
  TAAMBA: "Electrical grid expansion, monsoon transformer repairs",
  ALUMINIUM: "Automotive manufacturing shifts, EV battery demands",
  BATTERY: "Inverter season (peak summer load shedding)",
  PLASTIC: "Municipal recycling mandates",
  TYRE: "Pyrolysis oil factories, road tarring contracts",
  EWASTE: "Chip shortages, high-tech refurbishment units",
};

// ============================================
// DAILY RATE FLUCTUATION LOGIC
// ============================================

const MATERIAL_VOLATILITY: Record<Material, number> = {
  LOHA: 0.08,
  TAAMBA: 0.12,
  ALUMINIUM: 0.1,
  BATTERY: 0.15,
  PLASTIC: 0.2,
  TYRE: 0.18,
  EWASTE: 0.25,
};

const SEASONAL_MODIFIERS: Record<string, Partial<Record<Material, number>>> = {
  // Monsoon (July-August)
  MONSOON: {
    LOHA: 0.95, // Rust reduces quality
    TAAMBA: 1.1, // Transformer repairs spike demand
    BATTERY: 1.2, // Inverter demand
    EWASTE: 1.15,
  },
  // Shaadi Season (Nov-Feb)
  SHAADI_SEASON: {
    TAAMBA: 1.08, // Decorative wiring
    ALUMINIUM: 1.05,
    PLASTIC: 1.1, // Decoration materials
  },
  // Diwali (Oct-Nov)
  DIWALI_DHANTERAS: {
    TAAMBA: 1.15, // Lights, wiring
    EWASTE: 1.2, // Electronics gifting
    BATTERY: 1.1,
  },
  // Highway Strike
  HIGHWAY_STRIKE: {
    LOHA: 1.25, // Supply cutoff
    TAAMBA: 1.3,
    ALUMINIUM: 1.2,
    TYRE: 1.2,
  },
};

export function generateDailyRates(
  day: number,
  year: number,
  activeEvents: string[],
  previousRates?: Record<Material, number>
): Record<Material, ScrapRate> {
  const rates: Record<Material, ScrapRate> = {} as any;
  const materials: Material[] = ["LOHA", "TAAMBA", "ALUMINIUM", "BATTERY", "PLASTIC", "TYRE", "EWASTE"];

  for (const material of materials) {
    const base = BASE_SCRAP_RATES[material];
    let currentRate = previousRates?.[material] ?? base.baseRate;

    // Daily random walk with mean reversion
    const volatility = MATERIAL_VOLATILITY[material];
    const meanReversion = 0.05;
    const drift = (base.baseRate - currentRate) * meanReversion;
    const shock = (Math.random() - 0.5) * 2 * volatility * currentRate;
    currentRate = Math.max(base.minRate, Math.min(base.maxRate, currentRate + drift + shock));

    // Yearly inflation/trend (2000 -> 2030)
    const yearFactor = 1 + (year - 2000) * 0.03; // ~3% annual inflation
    currentRate *= yearFactor;

    // Active events modifiers
    for (const event of activeEvents) {
      const modifier = SEASONAL_MODIFIERS[event]?.[material];
      if (modifier) currentRate *= modifier;
    }

    // Clamp to min/max
    currentRate = Math.max(base.minRate, Math.min(base.maxRate, Math.round(currentRate)));

    // Determine trend
    const prev = previousRates?.[material] ?? base.baseRate;
    const trend = currentRate > prev * 1.02 ? "RISING" : currentRate < prev * 0.98 ? "FALLING" : "STABLE";

    rates[material] = {
      material,
      baseRate: base.baseRate,
      currentRate,
      minRate: base.minRate,
      maxRate: base.maxRate,
      trend,
      lastUpdated: day,
    };
  }

  return rates;
}

export function getRateDisplay(material: Material, rate: number): string {
  return `₹${rate}/kg`;
}

export function getTrendEmoji(trend: ScrapRate["trend"]): string {
  switch (trend) {
    case "RISING": return "📈";
    case "FALLING": return "📉";
    default: return "➡️";
  }
}