import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, VehicleInstance, Part, Transaction, ScrapRate, MarketListing, StaffMember, Loan, ProgressionStage, SeasonalEvent } from "@kabaad/shared";
import { VEHICLE_CATALOG, calculateScrapValue, calculateDismantleValue } from "@kabaad/shared/vehicles";
import { generateDailyRates, BASE_SCRAP_RATES } from "@kabaad/shared/scrapRates";
import { PROGRESSION_STAGES, checkProgressionRequirements } from "@kabaad/shared/progression";

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  advanceDay: () => void;
  addCash: (amount: number, billType?: "KACHHA" | "PAKKA") => void;
  buyVehicle: (vehicle: VehicleInstance, price: number, billType: "KACHHA" | "PAKKA") => boolean;
  sellVehicle: (vehicleId: string, price: number, billType: "KACHHA" | "PAKKA") => boolean;
  dismantleVehicle: (vehicleId: string) => Part[];
  sellPart: (partId: string, price: number) => boolean;
  sellScrap: (material: string, kg: number, rate: number) => boolean;
  repairVehicle: (vehicleId: string, partId: string, cost: number) => boolean;
  hireStaff: (staff: StaffMember) => boolean;
  fireStaff: (staffId: string) => void;
  takeLoan: (loan: Loan) => void;
  payLoanEMI: (loanId: string) => boolean;
  upgradeGarage: (upgradeId: string, cost: number) => boolean;
  unlockFeature: (feature: string) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "day">) => void;
  updateScrapRates: () => void;
  checkProgression: () => void;
  dismissStageToast: (stage: string) => void;
  saveGame: (slot: number) => void;
  loadGame: (slot: number) => boolean;
  resetGame: () => void;
}

const INITIAL_SCRAP_RATES = Object.fromEntries(
  Object.entries(BASE_SCRAP_RATES).map(([k, v]) => [k, { ...v, currentRate: v.baseRate, trend: "STABLE" as const, lastUpdated: 1 }])
) as Record<string, ScrapRate>;

const INITIAL_GAME_STATE: GameState = {
  currentDay: 1,
  currentYear: 2000,
  player: {
    cash: 5000,
    bankBalance: 0,
    totalAssets: 5000,
    kachhaRatio: 0,
    raidRiskMeter: 0,
    reputation: 0,
    progressionStage: "BORI_MAN",
    experience: 0,
  },
  inventory: {
    vehicles: [],
    parts: [],
    scrap: {},
    tools: ["magnet_stick", "pocket_scale"],
    upgrades: [],
  },
  staff: [],
  loans: [],
  scrapRates: Object.values(INITIAL_SCRAP_RATES),
  marketListings: [],
  transactionHistory: [],
  activeEvents: [],
  garageLevel: 1,
  unlockedFeatures: ["magnet_stick", "pocket_scale"],
  settings: {
    graphicsQuality: "MEDIUM",
    soundEnabled: true,
    musicEnabled: true,
    autoSave: true,
    language: "HINGLISH",
  },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_GAME_STATE,

      initializeGame: () => {
        set(INITIAL_GAME_STATE);
        get().updateScrapRates();
        get().generateMarketListings();
      },

      advanceDay: () => {
        const state = get();
        const newDay = state.currentDay + 1;
        const newYear = state.currentYear + Math.floor((newDay - 1) / 365);

        // Update scrap rates
        get().updateScrapRates();

        // Process daily events
        const activeEvents = get().calculateActiveEvents(newDay, newYear);

        // Pay staff salaries
        let totalSalaries = 0;
        state.staff.forEach((s) => {
          totalSalaries += s.salary;
          get().addCash(-s.salary);
          get().addTransaction({ type: "STAFF_SALARY", amount: -s.salary, notes: `Salary: ${s.name} (${s.role})` });
        });

        // Process loan EMIs
        state.loans.forEach((loan) => {
          if (loan.nextDueDay <= newDay) {
            get().payLoanEMI(loan.id);
          }
        });

        // Update seasonal events effects
        // ... event logic here

        // Check progression
        get().checkProgression();

        set({
          currentDay: newDay,
          currentYear: newYear,
          activeEvents,
        });

        // Auto save
        if (state.settings.autoSave) {
          get().saveGame(0);
        }
      },

      addCash: (amount, billType) => {
        const state = get();
        let newKachhaRatio = state.player.kachhaRatio;
        let newRaidRisk = state.player.raidRiskMeter;

        if (billType === "KACHHA" && amount > 0) {
          const totalIncome = state.transactionHistory.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) + amount;
          const kachhaIncome = state.transactionHistory.filter((t) => t.amount > 0 && t.billType === "KACHHA").reduce((sum, t) => sum + t.amount, 0) + amount;
          newKachhaRatio = totalIncome > 0 ? kachhaIncome / totalIncome : 0;
          newRaidRisk = Math.min(100, newKachhaRatio * 200); // 40% kachha = 80% raid risk
        } else if (billType === "PAKKA" && amount > 0) {
          const totalIncome = state.transactionHistory.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) + amount;
          const kachhaIncome = state.transactionHistory.filter((t) => t.amount > 0 && t.billType === "KACHHA").reduce((sum, t) => sum + t.amount, 0);
          newKachhaRatio = totalIncome > 0 ? kachhaIncome / totalIncome : 0;
          newRaidRisk = Math.min(100, newKachhaRatio * 200);
        }

        set({
          player: {
            ...state.player,
            cash: state.player.cash + amount,
            kachhaRatio: newKachhaRatio,
            raidRiskMeter: newRaidRisk,
          },
        });
      },

      buyVehicle: (vehicle, price, billType) => {
        const state = get();
        if (state.player.cash < price) return false;
        if (state.inventory.vehicles.length >= PROGRESSION_STAGES.find((s) => s.id === state.player.progressionStage)?.maxVehiclesInYard ?? 0) return false;

        get().addCash(-price, billType);
        get().addTransaction({ type: "BUY_VEHICLE", amount: -price, billType, counterparty: vehicle.specId, notes: `Bought ${vehicle.specId}` });

        set({
          inventory: {
            ...state.inventory,
            vehicles: [...state.inventory.vehicles, vehicle],
          },
        });
        return true;
      },

      sellVehicle: (vehicleId, price, billType) => {
        const state = get();
        const vehicleIndex = state.inventory.vehicles.findIndex((v) => v.specId === vehicleId);
        if (vehicleIndex === -1) return false;

        const vehicle = state.inventory.vehicles[vehicleIndex];
        get().addCash(price, billType);
        get().addTransaction({ type: "SELL_VEHICLE", amount: price, billType, counterparty: vehicleId, notes: `Sold ${vehicleId}` });

        set({
          inventory: {
            ...state.inventory,
            vehicles: state.inventory.vehicles.filter((_, i) => i !== vehicleIndex),
          },
        });
        return true;
      },

      dismantleVehicle: (vehicleId) => {
        const state = get();
        const vehicleIndex = state.inventory.vehicles.findIndex((v) => v.specId === vehicleId);
        if (vehicleIndex === -1) return [];

        const vehicle = state.inventory.vehicles[vehicleIndex];
        const spec = VEHICLE_CATALOG.find((v) => v.id === vehicleId);
        if (!spec) return [];

        // Generate parts based on vehicle condition
        const parts: Part[] = spec.parts.map((p) => ({
          ...p,
          id: `${vehicleId}_${p.id}_${Date.now()}`,
          condition: (["SCRAP", "POOR", "FAIR", "GOOD", "EXCELLENT"] as const)[Math.floor(Math.random() * 3) + 1], // FAIR to EXCELLENT
          baseValue: p.baseValue || Math.round(p.weightKg! * (INITIAL_SCRAP_RATES[p.material!]?.currentRate || 10)),
        }));

        get().addTransaction({ type: "DISMANTLE", amount: 0, notes: `Dismantled ${vehicleId} into ${parts.length} parts` });

        set({
          inventory: {
            ...state.inventory,
            vehicles: state.inventory.vehicles.filter((_, i) => i !== vehicleIndex),
            parts: [...state.inventory.parts, ...parts],
          },
        });

        return parts;
      },

      sellPart: (partId, price) => {
        const state = get();
        const partIndex = state.inventory.parts.findIndex((p) => p.id === partId);
        if (partIndex === -1) return false;

        get().addCash(price);
        get().addTransaction({ type: "SELL_PART", amount: price, notes: `Sold part ${partId}` });

        set({
          inventory: {
            ...state.inventory,
            parts: state.inventory.parts.filter((_, i) => i !== partIndex),
          },
        });
        return true;
      },

      sellScrap: (material, kg, rate) => {
        const state = get();
        const currentKg = state.inventory.scrap[material as any] || 0;
        if (currentKg < kg) return false;

        const price = kg * rate;
        get().addCash(price);
        get().addTransaction({ type: "SELL_SCRAP", amount: price, notes: `Sold ${kg}kg ${material} @ ₹${rate}/kg` });

        set({
          inventory: {
            ...state.inventory,
            scrap: {
              ...state.inventory.scrap,
              [material]: currentKg - kg,
            },
          },
        });
        return true;
      },

      repairVehicle: (vehicleId, partId, cost) => {
        const state = get();
        if (state.player.cash < cost) return false;

        get().addCash(-cost);
        get().addTransaction({ type: "REPAIR", amount: -cost, notes: `Repaired ${partId} on ${vehicleId}` });
        return true;
      },

      hireStaff: (staff) => {
        const state = get();
        const stageData = PROGRESSION_STAGES.find((s) => s.id === state.player.progressionStage);
        if (!stageData || state.staff.length >= stageData.maxStaff) return false;
        if (state.player.cash < staff.salary * 3) return false; // 3 months reserve

        set({ staff: [...state.staff, staff] });
        get().addTransaction({ type: "STAFF_SALARY", amount: 0, notes: `Hired ${staff.name} (${staff.role})` });
        return true;
      },

      fireStaff: (staffId) => {
        set({ staff: get().staff.filter((s) => s.id !== staffId) });
      },

      takeLoan: (loan) => {
        set({ loans: [...get().loans, loan] });
        get().addCash(loan.principal);
        get().addTransaction({ type: "LOAN_PAYMENT", amount: loan.principal, notes: `Loan received: ${loan.id}` });
      },

      payLoanEMI: (loanId) => {
        const state = get();
        const loan = state.loans.find((l) => l.id === loanId);
        if (!loan) return false;
        if (state.player.cash < loan.emi) {
          // Missed payment
          set({
            loans: state.loans.map((l) => (l.id === loanId ? { ...l, missedPayments: l.missedPayments + 1 } : l)),
          });
          get().addTransaction({ type: "LOAN_PAYMENT", amount: 0, notes: `MISSED EMI: ${loanId}` });
          return false;
        }

        get().addCash(-loan.emi);
        set({
          loans: state.loans.map((l) =>
            l.id === loanId
              ? { ...l, remaining: l.remaining - loan.emi, nextDueDay: l.nextDueDay + 30, missedPayments: 0 }
              : l
          ),
        });
        get().addTransaction({ type: "LOAN_PAYMENT", amount: -loan.emi, notes: `EMI paid: ${loanId}` });
        return true;
      },

      upgradeGarage: (upgradeId, cost) => {
        const state = get();
        if (state.player.cash < cost) return false;
        if (state.inventory.upgrades.includes(upgradeId)) return false;

        get().addCash(-cost);
        get().addTransaction({ type: "UPGRADE", amount: -cost, notes: `Garage upgrade: ${upgradeId}` });
        set({
          inventory: { ...state.inventory, upgrades: [...state.inventory.upgrades, upgradeId] },
          garageLevel: state.garageLevel + 1,
        });
        return true;
      },

      unlockFeature: (feature) => {
        set({ unlockedFeatures: [...get().unlockedFeatures, feature] });
      },

      addTransaction: (tx) => {
        set({
          transactionHistory: [
            ...get().transactionHistory,
            { ...tx, id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, day: get().currentDay },
          ],
        });
      },

      updateScrapRates: () => {
        const state = get();
        const newRates = generateDailyRates(state.currentDay, state.currentYear, state.activeEvents);
        set({ scrapRates: Object.values(newRates) });
      },

      generateMarketListings: () => {
        // Generate 5-10 random market listings
        const listings: MarketListing[] = [];
        const count = 5 + Math.floor(Math.random() * 6);
        for (let i = 0; i < count; i++) {
          const vehicle = VEHICLE_CATALOG[Math.floor(Math.random() * VEHICLE_CATALOG.length)];
          const condition = ["SCRAP", "DAMAGED", "REPAIRABLE", "GOOD"] as const[Math.floor(Math.random() * 4)];
          const priceVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of base
          listings.push({
            id: `listing_${Date.now()}_${i}`,
            vehicle: {
              specId: vehicle.id,
              condition,
              healthPercent: condition === "SCRAP" ? 20 : condition === "DAMAGED" ? 40 : condition === "REPAIRABLE" ? 65 : 85,
              partsHealth: {},
              mileage: Math.floor(Math.random() * 200000),
              registrationState: ["DL", "MH", "UP", "PB", "HR"][Math.floor(Math.random() * 5)],
            },
            askingPrice: Math.round(vehicle.basePrice * priceVariation),
            billType: Math.random() > 0.6 ? "KACHHA" : "PAKKA",
            listedDay: get().currentDay,
            sellerType: ["AUCTION", "PRIVATE", "BANK_RECOVERY"][Math.floor(Math.random() * 3)] as any,
            negotiable: true,
          });
        }
        set({ marketListings: listings });
      },

      checkProgression: () => {
        const state = get();
        const { canProgress, nextStage } = checkProgressionRequirements(state.player.progressionStage, state.player.totalAssets, state.player.reputation);
        if (canProgress && nextStage) {
          set({ player: { ...state.player, progressionStage: nextStage } });
          get().unlockFeature(`stage_toast_${nextStage}`);
          // Grant stage unlock bonuses
          const nextStageData = PROGRESSION_STAGES.find((s) => s.id === nextStage);
          if (nextStageData) {
            get().addCash(nextStageData.startingCash);
          }
        }
      },

      dismissStageToast: (stage) => {
        set({ unlockedFeatures: [...get().unlockedFeatures, `stage_toast_${stage}`] });
      },

      saveGame: (slot) => {
        const state = get();
        const saveData = {
          slot,
          gameState: state,
          savedAt: Date.now(),
          playtimeMinutes: 0, // TODO: track playtime
        };
        localStorage.setItem(`kabaad_save_${slot}`, JSON.stringify(saveData));
      },

      loadGame: (slot) => {
        try {
          const saveData = localStorage.getItem(`kabaad_save_${slot}`);
          if (!saveData) return false;
          const parsed = JSON.parse(saveData);
          set(parsed.gameState);
          return true;
        } catch {
          return false;
        }
      },

      resetGame: () => {
        set(INITIAL_GAME_STATE);
        get().initializeGame();
      },

      calculateActiveEvents: (day: number, year: number): SeasonalEvent[] => {
        const events: SeasonalEvent[] = [];
        const month = ((day - 1) % 360) / 30; // 12 months of 30 days

        // Monsoon: July-August (months 6-7)
        if (month >= 6 && month < 8) events.push("MONSOON");
        // Shaadi Season: Nov-Feb (months 10-1)
        if (month >= 10 || month < 2) events.push("SHAADI_SEASON");
        // Diwali: Oct-Nov (month 9-10) - simplified
        if (month >= 9 && month < 10) events.push("DIWALI_DHANTERAS");
        // Highway Strike: random 5% chance
        if (Math.random() < 0.05) events.push("HIGHWAY_STRIKE");

        return events;
      },
    }),
    {
      name: "kabaad-game-save",
      version: 1,
      partialize: (state) => ({
        currentDay: state.currentDay,
        currentYear: state.currentYear,
        player: state.player,
        inventory: state.inventory,
        staff: state.staff,
        loans: state.loans,
        scrapRates: state.scrapRates,
        marketListings: state.marketListings,
        transactionHistory: state.transactionHistory.slice(-100), // Keep last 100
        activeEvents: state.activeEvents,
        garageLevel: state.garageLevel,
        unlockedFeatures: state.unlockedFeatures,
        settings: state.settings,
      }),
    }
  )
);