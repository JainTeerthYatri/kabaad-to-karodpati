import { ProgressionStage, VehicleCategory } from "./types";

// ============================================
// 6-STAGE PROGRESSION - From PRD
// ============================================

export interface ProgressionStageData {
  id: ProgressionStage;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  startingCash: number;
  unlocks: string[];
  equipment: string[];
  vehicles: VehicleCategory[];
  maxVehiclesInYard: number;
  maxStaff: number;
  garageSize: string;
  requiredAssets: number; // Total assets to unlock next stage
  requiredReputation: number;
  dailyEvents: string[];
  specialMechanics: string[];
}

export const PROGRESSION_STAGES: ProgressionStageData[] = [
  {
    id: "BORI_MAN",
    name: "The Bori-Man (Footpath Collector)",
    nameHindi: "बोरी-मैन (फुटपाथ कलेक्टर)",
    description: "Walk alleys with a burlap sack, magnet stick, and pocket weighing hook. Pick copper cables, plastic bottles, iron rods. Sell to local kabaadi at sundown.",
    descriptionHindi: "बोरिया लेकर गलियों में घूमो। चुंबक स्टिक और पॉकेट वेइंग हुक से तांबा केबल, प्लास्टिक बोतल, लोहे की छड़ें उठाओ। शाम को लोकल कबाड़ी को बेचो।",
    startingCash: 500,
    unlocks: ["magnet_stick", "pocket_scale", "burlap_sack"],
    equipment: ["Burlap Sack (Bori)", "Magnet Stick", "Pocket Weighing Hook"],
    vehicles: [],
    maxVehiclesInYard: 0,
    maxStaff: 0,
    garageSize: "Footpath",
    requiredAssets: 10000,
    requiredReputation: 0,
    dailyEvents: ["random_scrap_spawn", "kabaadi_negotiation"],
    specialMechanics: ["stamina_system", "manual_collection", "sundown_sale_deadline"],
  },
  {
    id: "THELA_WALA",
    name: "The Thela-Wala (Mobile Trader)",
    nameHindi: "ठेला-वाला (मोबाइल ट्रेडर)",
    description: "Navigate colonies on a wooden handcart with brass bell and tarazu. Haggle with housewives for old fans, broken inverters, bicycle frames. Shout 'Kabaad le lo!'",
    descriptionHindi: "लकड़ी के ठेले पर पीतल की घंटी और तराजू के साथ कॉलोनियों में घूमो। गृहिणियों से पुराने पंखे, टूटे इन्वर्टर, साइकिल फ्रेम के लिए मोलभाव करो। 'कबाड़ ले लो!' चिल्लाओ।",
    startingCash: 5000,
    unlocks: ["handcart_thela", "brass_bell", "tarazu_scale", "colony_routes"],
    equipment: ["Four-wheel Wooden Handcart (Thela)", "Traditional Balance Scale (Tarazu)", "Brass Hand Bell"],
    vehicles: [],
    maxVehiclesInYard: 0,
    maxStaff: 0,
    garageSize: "Mobile",
    requiredAssets: 50000,
    requiredReputation: 10,
    dailyEvents: ["colony_haggling", "housewife_negotiation", "route_optimization"],
    specialMechanics: ["route_planning", "haggling_minigame", "weight_cheat_risk", "police_challan_risk"],
  },
  {
    id: "GALLI_GARAGE",
    name: "Galli Garage & First Car Flip",
    nameHindi: "गली गैराज और पहली कार फ्लिप",
    description: "Rent a shutter garage in auto market. Buy first flooded/accidental Marutam 800 for ₹12,000. Strip parts, rebuild carburetor, hand-polish body, flip for ₹45,000.",
    descriptionHindi: "ऑटो मार्केट में शटर गैराज किराए पर लो। पहली फ्लडेड/एक्सीडेंटल मारुति 800 ₹12,000 में खरीदो। पार्ट्स निकालो, कार्बोरेटर रीबिल्ड करो, बॉडी पॉलिश करो, ₹45,000 में बेचो।",
    startingCash: 25000,
    unlocks: ["garage_rent", "hydraulic_jack", "socket_wrench_set", "carburetor_rebuild", "body_polish", "first_car_flip"],
    equipment: ["Rented Single Shutter Garage", "Hydraulic Trolley Jack", "Basic Socket Wrench Set"],
    vehicles: ["TWO_WHEELER", "HATCHBACK"],
    maxVehiclesInYard: 2,
    maxStaff: 1,
    garageSize: "Small (1 Bay)",
    requiredAssets: 200000,
    requiredReputation: 25,
    dailyEvents: ["vehicle_acquisition", "dismantling", "part_refurbishment", "flip_sale"],
    specialMechanics: ["dismantling_minigame", "part_condition_assessment", "repair_vs_scrap_decision", "cash_flow_management"],
  },
  {
    id: "DEALERSHIP",
    name: "Used Car Dealership & Spare Parts Dukaan",
    nameHindi: "यूज्ड कार डीलरशिप और स्पेयर पार्ट्स दुकान",
    description: "Roadside showroom with colorful flags. Bid in bank auctions for seized cars. Clear RTO paperwork, refurbish interiors, maintain 10-15 car forecourt with EMI financing.",
    descriptionHindi: "रंगीन झंडों वाला रोडसाइड शोरूम। बैंक ऑक्शन में सीज़्ड कारों पर बोली लगाओ। RTO पेपरवर्क क्लियर करो, इंटीरियर रीफर्बिश करो, 10-15 कारों का फोरकोर्ट EMI के साथ मेंटेन करो।",
    startingCash: 100000,
    unlocks: ["showroom_flags", "tyre_inflator", "billing_computer", "bank_auction_access", "rto_clearance", "emi_financing", "forecourt_management"],
    equipment: ["Roadside Showroom with Flags", "Tyre Inflator", "Computer Billing Desk", "Office Cabin"],
    vehicles: ["TWO_WHEELER", "HATCHBACK", "SEDAN", "SUV"],
    maxVehiclesInYard: 15,
    maxStaff: 3,
    garageSize: "Medium (3 Bays + Showroom)",
    requiredAssets: 1000000,
    requiredReputation: 50,
    dailyEvents: ["bank_auction", "rto_paperwork", "customer_walkin", "emi_collection", "parts_sales"],
    specialMechanics: ["auction_bidding", "rto_noc_fitness", "kachha_vs_pakka_billing", "customer_negotiation_chat", "staff_management", "loan_disbursement"],
  },
  {
    id: "INDUSTRIAL_YARD",
    name: "Industrial Scrap Yard & Dismantling Hub",
    nameHindi: "इंडस्ट्रियल स्क्रैप यार्ड और डिसमेंटलिंग हब",
    description: "2-acre fenced yard with JLD excavator, 10-car stacking racks, 3 recovery flatbeds. Municipal scrap contracts. Dismantle 20 trucks/buses weekly. Supply shredded metal to steel mills.",
    descriptionHindi: "2 एकड़ का फेंस्ड यार्ड JLD एक्सकेवेटर, 10-कार स्टैकिंग रैक, 3 रिकवरी फ्लैटबेड के साथ। म्युनिसिपल स्क्रैप कॉन्ट्रैक्ट। हफ्ते में 20 ट्रक/बस डिसमेंटल करो। स्टील मिल्स को श्रेडेड मेटल सप्लाई करो।",
    startingCash: 500000,
    unlocks: ["excavator_jld", "stacking_racks", "recovery_flatbeds", "municipal_contracts", "shredder_access", "steel_mill_supply", "fleet_management"],
    equipment: ["2-Acre Fenced Yard", "JLD Excavator with Hydraulic Claw", "10-Car Stacking Racks", "3 Recovery Flatbeds", "Industrial Shredder"],
    vehicles: ["TWO_WHEELER", "HATCHBACK", "SEDAN", "SUV", "COMMERCIAL", "HEAVY"],
    maxVehiclesInYard: 100,
    maxStaff: 15,
    garageSize: "Large Industrial (10+ Bays + Yard)",
    requiredAssets: 10000000,
    requiredReputation: 75,
    dailyEvents: ["municipal_contract", "fleet_dismantling", "steel_mill_delivery", "heavy_machinery_maintenance"],
    specialMechanics: ["bulk_dismantling", "contract_management", "heavy_machinery_ops", "environmental_compliance", "union_relations", "logistics_optimization"],
  },
  {
    id: "TYCOON",
    name: "The Desi Automotive Tycoon",
    nameHindi: "देसी ऑटोमोटिव टाइकून",
    description: "Automated Li-ion battery recycling, EV retrofit kit manufacturing, pan-India dealer network. Shape state policies. Export recycled copper/aluminium globally. Billionaire status with private luxury fleet.",
    descriptionHindi: "ऑटोमेटेड Li-ion बैटरी रीसाइक्लिंग, EV रेट्रोफिट किट मैन्युफैक्चरिंग, पैन-इंडिया डीलर नेटवर्क। स्टेट पॉलिसी बनाओ। रीसाइक्ल्ड कॉपर/एल्युमिनियम ग्लोबली एक्सपोर्ट करो। प्राइवेट लग्जरी फ्लीट के साथ बिलियनेयर स्टेटस।",
    startingCash: 5000000,
    unlocks: ["battery_recycling_plant", "ev_retrofit_factory", "pan_india_network", "policy_influence", "global_export", "luxury_fleet", "private_jet"],
    equipment: ["Automated Li-ion Battery Recycling Facility", "EV Retrofit Kit Manufacturing Plant", "Authorized Pan-India Dealer Network", "Corporate HQ"],
    vehicles: ["TWO_WHEELER", "HATCHBACK", "SEDAN", "SUV", "COMMERCIAL", "HEAVY"],
    maxVehiclesInYard: 999,
    maxStaff: 100,
    garageSize: "Empire (Multiple Facilities)",
    requiredAssets: Infinity,
    requiredReputation: 100,
    dailyEvents: ["policy_meeting", "global_trade", "rnd_projects", "acquisition_targets", "board_meeting"],
    specialMechanics: ["policy_lobbying", "international_trade", "rnd_management", "m_a_activity", "brand_management", "succession_planning"],
  },
];

export function getStageData(stage: ProgressionStage): ProgressionStageData | undefined {
  return PROGRESSION_STAGES.find((s) => s.id === stage);
}

export function getNextStage(current: ProgressionStage): ProgressionStage | null {
  const currentIndex = PROGRESSION_STAGES.findIndex((s) => s.id === current);
  if (currentIndex >= 0 && currentIndex < PROGRESSION_STAGES.length - 1) {
    return PROGRESSION_STAGES[currentIndex + 1].id;
  }
  return null;
}

export function checkProgressionRequirements(
  currentStage: ProgressionStage,
  totalAssets: number,
  reputation: number
): { canProgress: boolean; nextStage: ProgressionStage | null; requirementsMet: { assets: boolean; reputation: boolean } } {
  const current = getStageData(currentStage);
  const next = getNextStage(currentStage);
  if (!current || !next) return { canProgress: false, nextStage: null, requirementsMet: { assets: false, reputation: false } };

  const nextData = getStageData(next)!;
  const assetsMet = totalAssets >= nextData.requiredAssets;
  const reputationMet = reputation >= nextData.requiredReputation;

  return {
    canProgress: assetsMet && reputationMet,
    nextStage: next,
    requirementsMet: { assets: assetsMet, reputation: reputationMet },
  };
}

export function getStageProgress(currentStage: ProgressionStage, totalAssets: number, reputation: number): number {
  const current = getStageData(currentStage);
  const next = getNextStage(currentStage);
  if (!current || !next) return 100;

  const nextData = getStageData(next)!;
  const assetProgress = Math.min(100, (totalAssets / nextData.requiredAssets) * 100);
  const repProgress = Math.min(100, (reputation / nextData.requiredReputation) * 100);

  return Math.min(assetProgress, repProgress);
}