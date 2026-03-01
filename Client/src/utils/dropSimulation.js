const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const DROP_FEFCO_OPTIONS = [
  { id: "0201", label: "FEFCO 0201" },
  { id: "0203", label: "FEFCO 0203" },
  { id: "0301", label: "FEFCO 0301" },
  { id: "0401", label: "FEFCO 0401" },
  { id: "0427", label: "FEFCO 0427" },
];

export const DROP_PADDING_OPTIONS = [
  { id: "none", label: "No padding" },
  { id: "bubble", label: "Bubble wrap" },
  { id: "foam", label: "Foam insert" },
  { id: "paper", label: "Kraft paper" },
];

export const DROP_ORIENTATION_OPTIONS = [
  { id: "flat", label: "Flat" },
  { id: "side", label: "Side" },
  { id: "edge", label: "Edge" },
];

export const DROP_FRAGILITY_OPTIONS = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export const DEFAULT_DROP_SIMULATION = {
  fefcoCode: "0201",
  dimensions: { l: 191, w: 383, h: 245 },
  weightGrams: 600,
  fragility: "medium",
  dropHeightCm: 100,
  orientation: "flat",
  padding: "none",
  thickness: 1.5,
  material: "Corrugated Board",
};

export const parseWeightToGrams = (input, fallback = 600) => {
  if (typeof input === "number" && Number.isFinite(input)) {
    return Math.round(clamp(input, 10, 50000));
  }

  if (typeof input !== "string" || input.trim().length === 0) {
    return fallback;
  }

  const value = input.trim().toLowerCase();
  const match = value.match(/(\d+(\.\d+)?)/);
  if (!match) return fallback;

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return fallback;

  if (value.includes("kg")) {
    return Math.round(clamp(amount * 1000, 10, 50000));
  }

  return Math.round(clamp(amount, 10, 50000));
};

const materialStrengthFactor = (material = "") => {
  const key = material.toLowerCase();

  if (key.includes("corrugated")) return 1.15;
  if (key.includes("kraft")) return 1.05;
  if (key.includes("white card")) return 0.95;
  return 1;
};

const fragilityGThreshold = {
  low: 120,
  medium: 75,
  high: 45,
};

const paddingProfile = {
  none: { decelExtra: 0, protectionBoost: 1, visualDamping: 0.16 },
  bubble: { decelExtra: 0.012, protectionBoost: 1.25, visualDamping: 0.22 },
  foam: { decelExtra: 0.02, protectionBoost: 1.5, visualDamping: 0.3 },
  paper: { decelExtra: 0.007, protectionBoost: 1.12, visualDamping: 0.19 },
};

const orientationSeverity = {
  flat: 1,
  side: 1.15,
  edge: 1.35,
};

export const getDropSimulationDynamics = ({ padding = "none", orientation = "flat" } = {}) => {
  const pad = paddingProfile[padding] || paddingProfile.none;
  const orientationFactor = orientationSeverity[orientation] || orientationSeverity.flat;

  return {
    restitution: clamp(0.14 + pad.visualDamping * 0.6 - (orientationFactor - 1) * 0.08, 0.08, 0.32),
    compression: clamp(0.06 + pad.visualDamping * 0.12, 0.05, 0.13),
    wobble: clamp(0.08 + orientationFactor * 0.08, 0.1, 0.24),
  };
};

export const estimateDropOutcome = ({
  weightGrams,
  dropHeightCm,
  fragility,
  padding,
  orientation,
  thickness,
  material,
}) => {
  const g = 9.81;
  const massKg = clamp(weightGrams / 1000, 0.01, 50);
  const heightM = clamp(dropHeightCm / 100, 0.1, 5);
  const velocity = Math.sqrt(2 * g * heightM);
  const energy = massKg * g * heightM;

  const pad = paddingProfile[padding] || paddingProfile.none;
  const orientationFactor = orientationSeverity[orientation] || orientationSeverity.flat;
  const materialFactor = materialStrengthFactor(material);
  const thicknessFactor = clamp(0.75 + thickness * 0.2, 0.75, 1.6);

  const decelDistanceM = clamp(
    (0.008 + pad.decelExtra + thickness * 0.0012) * materialFactor * thicknessFactor / orientationFactor,
    0.005,
    0.06,
  );

  const peakG = velocity * velocity / (2 * decelDistanceM * g);
  const limitG = fragilityGThreshold[fragility] || fragilityGThreshold.medium;
  const adjustedTolerance = limitG * pad.protectionBoost;
  const riskRatio = peakG / adjustedTolerance;
  const riskScore = Math.round(clamp(riskRatio * 100, 0, 100));

  let riskBand = "Low";
  if (riskScore > 80) riskBand = "Severe";
  else if (riskScore > 60) riskBand = "High";
  else if (riskScore > 35) riskBand = "Medium";

  const impactForceN = massKg * peakG * g;

  return {
    impactVelocity: velocity,
    impactEnergy: energy,
    peakG,
    impactForceN,
    riskScore,
    riskBand,
    survivability: Math.round(clamp(100 - riskScore, 0, 100)),
    decelDistanceM,
  };
};

export const normalizeFragility = (value) => {
  const key = String(value || "").toLowerCase();
  if (key === "low" || key === "medium" || key === "high") return key;
  return "medium";
};
