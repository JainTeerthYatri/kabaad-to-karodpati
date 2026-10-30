import { z } from "zod";

// ============================================
// CORE TYPES - Single source of truth for all platforms
// ============================================

export const MaterialSchema = z.enum([
  "LOHA",
  "TAAMBA",
  "ALUMINIUM",
  "BATTERY",
  "PLASTIC",
  "TYRE",
  "EWASTE",
]);
export type Material = z.infer<typeof MaterialSchema>;

export const VehicleCategorySchema = z.enum([
  "TWO_WHEELER",
  "HATCHBACK",
  "SEDAN",
  "SUV",
  "COMMERCIAL",
  "HEAVY",
]);
export type VehicleCategory = z.infer<typeof VehicleCategorySchema>;

export const VehicleConditionSchema = z.enum([
  "SCRAP",
  "DAMAGED",
  "REPAIRABLE",
  "GOOD",
  "EXCELLENT",
]);
export type VehicleCondition = z.infer<typeof VehicleConditionSchema>;

export const BillTypeSchema = z.enum(["KACHHA", "PAKKA"]);
export type BillType = z.infer<typeof BillTypeSchema>;

export const ProgressionStageSchema = z.enum([
  "BORI_MAN",
  "THELA_WALA",
  "GALLI_GARAGE",
  "DEALERSHIP",
  "INDUSTRIAL_YARD",
  "TYCOON",
]);
export type ProgressionStage = z.infer<typeof ProgressionStageSchema>;

export const SeasonalEventSchema = z.enum([
  "MONSOON",
  "SHAADI_SEASON",
  "DIWALI_DHANTERAS",
  "HIGHWAY_STRIKE",
]);
export type SeasonalEvent = z.infer<typeof SeasonalEventSchema>;

// ============================================
// VEHICLE & PARTS
// ============================================

export const PartConditionSchema = z.enum([
  "SCRAP",
  "POOR",
  "FAIR",
  "GOOD",
  "EXCELLENT",
]);
export type PartCondition = z.infer<typeof PartConditionSchema>;

export const PartSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(), // engine, gearbox, body, electrical, interior, wheels
  baseValue: z.number(),
  condition: PartConditionSchema,
  material: MaterialSchema.optional(),
  weightKg: z.number().optional(),
  installable: z.boolean().default(true),
  compatibleModels: z.array(z.string()).default([]),
});
export type Part = z.infer<typeof PartSchema>;

export const VehicleSpecSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  category: VehicleCategorySchema,
  basePrice: z.number(),
  curbWeightKg: z.number(),
  parts: z.array(PartSchema),
  scrapValue: z.number(), // Quick crush value
  fuelType: z.enum(["PETROL", "DIESEL", "CNG", "ELECTRIC", "MANUAL"]),
  engineCC: z.number().optional(),
  description: z.string(),
  rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "LEGENDARY"]).default("COMMON"),
});
export type VehicleSpec = z.infer<typeof VehicleSpecSchema>;

export const VehicleInstanceSchema = z.object({
  specId: z.string(),
  condition: VehicleConditionSchema,
  healthPercent: z.number().min(0).max(100),
  partsHealth: z.record(z.string(), z.number().min(0).max(100)), // partId -> health
  mileage: z.number().default(0),
  registrationState: z.string().default("DL"),
  fitnessExpiry: z.number().optional(), // timestamp
  challans: z.array(z.object({ id: z.string(), amount: z.number(), paid: z.boolean() })).default([]),
  ownerHistory: z.number().default(1),
  isStolen: z.boolean().default(false),
  isSeized: z.boolean().default(false),
});
export type VehicleInstance = z.infer<typeof VehicleInstanceSchema>;

// ============================================
// ECONOMY & MARKET
// ============================================

export const ScrapRateSchema = z.object({
  material: MaterialSchema,
  baseRate: z.number(), // ₹/kg
  currentRate: z.number(),
  minRate: z.number(),
  maxRate: z.number(),
  trend: z.enum(["RISING", "FALLING", "STABLE"]),
  lastUpdated: z.number(), // game day
});
export type ScrapRate = z.infer<typeof ScrapRateSchema>;

export const MarketListingSchema = z.object({
  id: z.string(),
  vehicle: VehicleInstanceSchema,
  askingPrice: z.number(),
  billType: BillTypeSchema,
  listedDay: z.number(),
  sellerType: z.enum(["PLAYER", "AUCTION", "PRIVATE", "BANK_RECOVERY"]),
  negotiable: z.boolean().default(true),
});
export type MarketListing = z.infer<typeof MarketListingSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  day: z.number(),
  type: z.enum(["BUY_VEHICLE", "SELL_VEHICLE", "SELL_PART", "SELL_SCRAP", "REPAIR", "UPGRADE", "LOAN_PAYMENT", "STAFF_SALARY", "BRIBE", "FINE", "BONUS"]),
  amount: z.number(), // positive = income, negative = expense
  billType: BillTypeSchema.optional(),
  counterparty: z.string().optional(),
  notes: z.string().optional(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

// ============================================
// PLAYER STATE
// ============================================

export const PlayerStatsSchema = z.object({
  cash: z.number().default(5000),
  bankBalance: z.number().default(0),
  totalAssets: z.number().default(0),
  kachhaRatio: z.number().default(0), // 0-1
  raidRiskMeter: z.number().default(0), // 0-100
  reputation: z.number().default(0), // -100 to 100
  progressionStage: ProgressionStageSchema.default("BORI_MAN"),
  experience: z.number().default(0),
});
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;

export const InventorySchema = z.object({
  vehicles: z.array(VehicleInstanceSchema).default([]),
  parts: z.array(PartSchema).default([]),
  scrap: z.record(MaterialSchema, z.number()).default({}), // material -> kg
  tools: z.array(z.string()).default([]),
  upgrades: z.array(z.string()).default([]),
});
export type Inventory = z.infer<typeof InventorySchema>;

export const StaffMemberSchema = z.object({
  id: z.string(),
  role: z.enum(["APPRENTICE", "MECHANIC", "DENTER", "ACCOUNTANT", "TOW_DRIVER"]),
  name: z.string(),
  skillLevel: z.number().min(1).max(10),
  salary: z.number(),
  morale: z.number().min(0).max(100).default(100),
  specialAbility: z.string(),
  hiredDay: z.number(),
});
export type StaffMember = z.infer<typeof StaffMemberSchema>;

export const LoanSchema = z.object({
  id: z.string(),
  principal: z.number(),
  remaining: z.number(),
  interestRate: z.number(), // annual %
  emi: z.number(),
  nextDueDay: z.number(),
  missedPayments: z.number().default(0),
  collateral: z.string().optional(),
});
export type Loan = z.infer<typeof LoanSchema>;

export const GameStateSchema = z.object({
  currentDay: z.number().default(1),
  currentYear: z.number().default(2000),
  player: PlayerStatsSchema,
  inventory: InventorySchema,
  staff: z.array(StaffMemberSchema).default([]),
  loans: z.array(LoanSchema).default([]),
  scrapRates: z.array(ScrapRateSchema).default([]),
  marketListings: z.array(MarketListingSchema).default([]),
  transactionHistory: z.array(TransactionSchema).default([]),
  activeEvents: z.array(SeasonalEventSchema).default([]),
  garageLevel: z.number().default(1),
  unlockedFeatures: z.array(z.string()).default([]),
  settings: z.object({
    graphicsQuality: z.enum(["LOW", "MEDIUM", "HIGH", "ULTRA"]).default("MEDIUM"),
    soundEnabled: z.boolean().default(true),
    musicEnabled: z.boolean().default(true),
    autoSave: z.boolean().default(true),
    language: z.enum(["EN", "HI", "HINGLISH"]).default("HINGLISH"),
  }).default({}),
});
export type GameState = z.infer<typeof GameStateSchema>;

// ============================================
// SAVE/LOAD
// ============================================

export const SaveSlotSchema = z.object({
  slot: z.number(),
  gameState: GameStateSchema,
  savedAt: z.number(), // real timestamp
  playtimeMinutes: z.number(),
});
export type SaveSlot = z.infer<typeof SaveSlotSchema>;

// ============================================
// EXPORTS
// ============================================

export type {
  Material,
  VehicleCategory,
  VehicleCondition,
  BillType,
  ProgressionStage,
  SeasonalEvent,
  PartCondition,
  Part,
  VehicleSpec,
  VehicleInstance,
  ScrapRate,
  MarketListing,
  Transaction,
  PlayerStats,
  Inventory,
  StaffMember,
  Loan,
  GameState,
  SaveSlot,
};