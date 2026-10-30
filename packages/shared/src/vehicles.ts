import {
  VehicleSpec,
  VehicleCategory,
  Material,
  PartCondition,
  Part,
} from "./types";

// ============================================
// VEHICLE CATALOG - From PRD (Parody Brands)
// ============================================

// Helper to create parts for a vehicle
const createParts = (vehicleId: string, category: VehicleCategory): Part[] => {
  const baseParts: Part[] = [
    {
      id: `${vehicleId}_engine`,
      name: "Engine",
      category: "engine",
      baseValue: 0,
      condition: "FAIR",
      weightKg: category === "HEAVY" ? 800 : category === "COMMERCIAL" ? 400 : 150,
      installable: true,
      compatibleModels: [vehicleId],
    },
    {
      id: `${vehicleId}_gearbox`,
      name: "Gearbox",
      category: "gearbox",
      baseValue: 0,
      condition: "FAIR",
      weightKg: 80,
      installable: true,
      compatibleModels: [vehicleId],
    },
    {
      id: `${vehicleId}_alternator`,
      name: "Alternator & Starter Motor",
      category: "electrical",
      baseValue: 0,
      condition: "GOOD",
      weightKg: 15,
      installable: true,
      compatibleModels: [vehicleId],
    },
    {
      id: `${vehicleId}_seats`,
      name: "Seats (Set)",
      category: "interior",
      baseValue: 0,
      condition: "POOR",
      weightKg: 40,
      installable: true,
      compatibleModels: [vehicleId],
    },
    {
      id: `${vehicleId}_wheels`,
      name: "Wheels with Tyres (4)",
      category: "wheels",
      baseValue: 0,
      condition: "FAIR",
      weightKg: 100,
      material: "TYRE",
      installable: true,
      compatibleModels: [vehicleId],
    },
    {
      id: `${vehicleId}_wiring`,
      name: "Copper Wiring Harness",
      category: "electrical",
      baseValue: 0,
      condition: "GOOD",
      weightKg: 25,
      material: "TAAMBA",
      installable: false,
      compatibleModels: [],
    },
    {
      id: `${vehicleId}_body`,
      name: "Steel Body Shell",
      category: "body",
      baseValue: 0,
      condition: "FAIR",
      weightKg: category === "HEAVY" ? 4000 : category === "COMMERCIAL" ? 2500 : 680,
      material: "LOHA",
      installable: false,
      compatibleModels: [],
    },
  ];
  return baseParts;
};

export const VEHICLE_CATALOG: VehicleSpec[] = [
  // ============ TWO WHEELERS ============
  {
    id: "cycle_rickshaw",
    brand: "Generic",
    model: "Cargo Rickshaw",
    year: 1990,
    category: "TWO_WHEELER",
    basePrice: 3000,
    curbWeightKg: 80,
    parts: createParts("cycle_rickshaw", "TWO_WHEELER"),
    scrapValue: 2400,
    fuelType: "MANUAL",
    description: "Zero fuel cost. Manual pedal stamina. The starting vehicle.",
    rarity: "COMMON",
  },
  {
    id: "balwan_chetak",
    brand: "Balwan Motors",
    model: "Chetak 2-Stroke",
    year: 1995,
    category: "TWO_WHEELER",
    basePrice: 12000,
    curbWeightKg: 110,
    parts: createParts("balwan_chetak", "TWO_WHEELER"),
    scrapValue: 4200,
    fuelType: "PETROL",
    engineCC: 150,
    description: "Smoky vintage scooter with side-step tire, manual hand clutch.",
    rarity: "COMMON",
  },
  {
    id: "rajput_thumper",
    brand: "Rajput Bullet",
    model: "Thumper 350",
    year: 2005,
    category: "TWO_WHEELER",
    basePrice: 45000,
    curbWeightKg: 190,
    parts: createParts("rajput_thumper", "TWO_WHEELER"),
    scrapValue: 8500,
    fuelType: "PETROL",
    engineCC: 350,
    description: "The heavy iron roadster. Resale value never drops. Dug-dug ka raaj.",
    rarity: "UNCOMMON",
  },
  {
    id: "tarang_450x",
    brand: "Volt-E",
    model: "Tarang 450X",
    year: 2022,
    category: "TWO_WHEELER",
    basePrice: 95000,
    curbWeightKg: 130,
    parts: createParts("tarang_450x", "TWO_WHEELER"),
    scrapValue: 15000,
    fuelType: "ELECTRIC",
    description: "Instant torque, high battery degradation risk in summer heat.",
    rarity: "RARE",
  },
  {
    id: "balwan_super_auto",
    brand: "Balwan Motors",
    model: "Super Auto CNG",
    year: 2010,
    category: "TWO_WHEELER",
    basePrice: 180000,
    curbWeightKg: 350,
    parts: createParts("balwan_super_auto", "TWO_WHEELER"),
    scrapValue: 25000,
    fuelType: "CNG",
    engineCC: 200,
    description: "Backbone of urban transport. High drift capability. Tuk-tuk life.",
    rarity: "COMMON",
  },
  {
    id: "bijli_erickshaw",
    brand: "Volt-E",
    model: "Bijli E-Rickshaw",
    year: 2018,
    category: "TWO_WHEELER",
    basePrice: 85000,
    curbWeightKg: 280,
    parts: createParts("bijli_erickshaw", "TWO_WHEELER"),
    scrapValue: 18000,
    fuelType: "ELECTRIC",
    description: "Cheap lead-acid battery, maximum mohalla penetration.",
    rarity: "COMMON",
  },

  // ============ HATCHBACKS & SEDANS ============
  {
    id: "marutam_800",
    brand: "Marutam Sakhi",
    model: "800",
    year: 1998,
    category: "HATCHBACK",
    basePrice: 15000,
    curbWeightKg: 650,
    parts: createParts("marutam_800", "HATCHBACK"),
    scrapValue: 22000,
    fuelType: "PETROL",
    engineCC: 796,
    description: "The Legend. Cheap parts at every corner. Indestructible simplicity.",
    rarity: "COMMON",
  },
  {
    id: "marutam_swiftar",
    brand: "Marutam Sakhi",
    model: "Swiftar",
    year: 2008,
    category: "HATCHBACK",
    basePrice: 120000,
    curbWeightKg: 950,
    parts: createParts("marutam_swiftar", "HATCHBACK"),
    scrapValue: 38000,
    fuelType: "PETROL",
    engineCC: 1200,
    description: "High demand in second-hand market. Favorite for young drivers and taxi fleets.",
    rarity: "UNCOMMON",
  },
  {
    id: "tatva_indica",
    brand: "Tatva Motors",
    model: "Indica V2 Diesel",
    year: 2004,
    category: "SEDAN",
    basePrice: 35000,
    curbWeightKg: 1100,
    parts: createParts("tatva_indica", "SEDAN"),
    scrapValue: 35000,
    fuelType: "DIESEL",
    engineCC: 1400,
    description: "Workhorse of commercial cab fleets. High mileage, rattles at 80 km/h.",
    rarity: "COMMON",
  },
  {
    id: "hd_cityracer",
    brand: "Hindustan Dynamics",
    model: "City-Racer Sedan",
    year: 2012,
    category: "SEDAN",
    basePrice: 450000,
    curbWeightKg: 1300,
    parts: createParts("hd_cityracer", "SEDAN"),
    scrapValue: 52000,
    fuelType: "PETROL",
    engineCC: 1600,
    description: "Premium executive feel. Preferred by bank managers and doctors.",
    rarity: "UNCOMMON",
  },

  // ============ RUGGED SUVS ============
  {
    id: "mahabal_bolermax",
    brand: "Mahabal Automotive",
    model: "Boler-Max",
    year: 2006,
    category: "SUV",
    basePrice: 180000,
    curbWeightKg: 1800,
    parts: createParts("mahabal_bolermax", "SUV"),
    scrapValue: 58000,
    fuelType: "DIESEL",
    engineCC: 2500,
    description: "Rural favorite. Can carry 12 people when rated for 7.",
    rarity: "UNCOMMON",
  },
  {
    id: "mahabal_tharox",
    brand: "Mahabal Automotive",
    model: "Thar-OX 4x4",
    year: 2015,
    category: "SUV",
    basePrice: 650000,
    curbWeightKg: 1950,
    parts: createParts("mahabal_tharox", "SUV"),
    scrapValue: 72000,
    fuelType: "DIESEL",
    engineCC: 2200,
    description: "Massive prestige value. Sells at premium during election and wedding seasons.",
    rarity: "RARE",
  },
  {
    id: "tatva_safariya",
    brand: "Tatva Motors",
    model: "Safariya Dicor",
    year: 2010,
    category: "SUV",
    basePrice: 550000,
    curbWeightKg: 2100,
    parts: createParts("tatva_safariya", "SUV"),
    scrapValue: 68000,
    fuelType: "DIESEL",
    engineCC: 2200,
    description: "VIP status with flashing strobe lights and dark tints.",
    rarity: "RARE",
  },

  // ============ COMMERCIAL & HEAVY ============
  {
    id: "tatva_chhota_hathi",
    brand: "Tatva Motors",
    model: "Chhota Hathi (Mini Tempo)",
    year: 2005,
    category: "COMMERCIAL",
    basePrice: 280000,
    curbWeightKg: 2500,
    parts: createParts("tatva_chhota_hathi", "COMMERCIAL"),
    scrapValue: 85000,
    fuelType: "DIESEL",
    engineCC: 3000,
    description: "Essential for moving kabaad from mohallas to the yard.",
    rarity: "UNCOMMON",
  },
  {
    id: "lakshya_1612",
    brand: "Lakshya Trucks",
    model: "1612 Highway Truck",
    year: 2008,
    category: "HEAVY",
    basePrice: 1200000,
    curbWeightKg: 9500,
    parts: createParts("lakshya_1612", "HEAVY"),
    scrapValue: 320000,
    fuelType: "DIESEL",
    engineCC: 6000,
    description: "10-wheeler with hand-painted truck art, wooden cabin, triple-tone horns.",
    rarity: "LEGENDARY",
  },
  {
    id: "jld_pila_panja",
    brand: "JLD Earthmovers",
    model: "Pila Panja Excavator",
    year: 2010,
    category: "HEAVY",
    basePrice: 2500000,
    curbWeightKg: 22000,
    parts: createParts("jld_pila_panja", "HEAVY"),
    scrapValue: 750000,
    fuelType: "DIESEL",
    engineCC: 8000,
    description: "Used for digging construction scrap, lifting engine blocks, crushing junk cars.",
    rarity: "LEGENDARY",
  },
];

// ============================================
// HELPERS
// ============================================

export const getVehicleById = (id: string): VehicleSpec | undefined =>
  VEHICLE_CATALOG.find((v) => v.id === id);

export const getVehiclesByCategory = (category: VehicleCategory): VehicleSpec[] =>
  VEHICLE_CATALOG.filter((v) => v.category === category);

export const getVehiclesByStage = (stage: string): VehicleSpec[] => {
  // Stage determines what vehicles are available/affordable
  const stageMaxPrice: Record<string, number> = {
    BORI_MAN: 5000,
    THELA_WALA: 20000,
    GALLI_GARAGE: 100000,
    DEALERSHIP: 500000,
    INDUSTRIAL_YARD: 2000000,
    TYCOON: Infinity,
  };
  const maxPrice = stageMaxPrice[stage] || Infinity;
  return VEHICLE_CATALOG.filter((v) => v.basePrice <= maxPrice);
};

export const calculateScrapValue = (vehicle: VehicleSpec, rates: Record<Material, number>): number => {
  let total = 0;
  for (const part of vehicle.parts) {
    if (part.material && rates[part.material] && part.weightKg) {
      total += part.weightKg * rates[part.material!];
    }
  }
  return Math.round(total);
};

export const calculateDismantleValue = (vehicle: VehicleSpec, rates: Record<Material, number>): number => {
  let total = 0;
  for (const part of vehicle.parts) {
    if (part.installable) {
      // Sell as part - condition affects price
      const conditionMultiplier = { SCRAP: 0.1, POOR: 0.3, FAIR: 0.5, GOOD: 0.75, EXCELLENT: 1.0 }[part.condition] || 0.5;
      total += part.baseValue * conditionMultiplier;
    } else if (part.material && rates[part.material] && part.weightKg) {
      // Sell as scrap
      total += part.weightKg * rates[part.material!];
    }
  }
  return Math.round(total);
};