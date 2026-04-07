const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const roundDimension = (value) => Number(clamp(value, 0, 100000).toFixed(2));

const toPositiveNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeDimensions = (dimensions = {}, fallback = {}) => ({
  l: toPositiveNumber(dimensions.l ?? dimensions.length, fallback.l ?? 0),
  w: toPositiveNumber(dimensions.w ?? dimensions.width, fallback.w ?? 0),
  h: toPositiveNumber(dimensions.h ?? dimensions.height, fallback.h ?? 0),
});

const median = (values = []) => {
  if (values.length === 0) return 1;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

export const MATERIAL_LIBRARY = {
  "3ply": {
    id: "3ply",
    label: "3-Ply Corrugated",
    boardThicknessMm: 3,
    boardGrade: "B-Flute",
    outerBufferFactor: 2,
  },
  "5ply": {
    id: "5ply",
    label: "5-Ply Heavy Duty",
    boardThicknessMm: 5,
    boardGrade: "BC-Flute",
    outerBufferFactor: 2.4,
  },
  recycled: {
    id: "recycled",
    label: "100% Recycled Kraft",
    boardThicknessMm: 1.5,
    boardGrade: "E-Flute",
    outerBufferFactor: 1.8,
  },
  "White card board": {
    id: "White card board",
    label: "White card board",
    boardThicknessMm: 0.6,
    boardGrade: "Folding Carton",
    outerBufferFactor: 1.2,
  },
  "Kraft paper": {
    id: "Kraft paper",
    label: "Kraft paper",
    boardThicknessMm: 1.2,
    boardGrade: "Kraft Wrap",
    outerBufferFactor: 1.4,
  },
  "Corrugated Board": {
    id: "Corrugated Board",
    label: "Corrugated Board",
    boardThicknessMm: 3,
    boardGrade: "B-Flute",
    outerBufferFactor: 2,
  },
};

const DEFAULT_MATERIAL = MATERIAL_LIBRARY["3ply"];

const FRAGILITY_PROFILES = {
  low: {
    insertionClearanceMm: 1,
    recommendedPaddingMm: 0,
    fillerSuggestion: "No filler or a light paper wrap is usually enough.",
  },
  medium: {
    insertionClearanceMm: 2,
    recommendedPaddingMm: 3,
    fillerSuggestion: "Add paper wrap or bubble wrap around the product.",
  },
  high: {
    insertionClearanceMm: 3,
    recommendedPaddingMm: 8,
    fillerSuggestion: "Use foam, molded pulp, or a dedicated insert around the product.",
  },
};

const STYLE_ALLOWANCE_FACTORS = {
  "0201": { l: 1, w: 1, h: 0.5 },
  "0203": { l: 1, w: 1, h: 0.5 },
  "0301": { l: 1, w: 1, h: 0.5 },
  "0401": { l: 0.8, w: 0.8, h: 0.4 },
  "0427": { l: 0.6, w: 0.6, h: 0.4 },
  default: { l: 1, w: 1, h: 0.5 },
};

export const getMaterialProfile = (material) =>
  MATERIAL_LIBRARY[material] || MATERIAL_LIBRARY[String(material || "").trim()] || DEFAULT_MATERIAL;

export const getFragilityProfile = (fragility) =>
  FRAGILITY_PROFILES[String(fragility || "").toLowerCase()] || FRAGILITY_PROFILES.medium;

const getStyleAllowance = (fefcoCode, boardThicknessMm) => {
  const digits = String(fefcoCode || "").replace(/\D/g, "");
  const factors = STYLE_ALLOWANCE_FACTORS[digits] || STYLE_ALLOWANCE_FACTORS.default;

  return {
    l: roundDimension(boardThicknessMm * factors.l),
    w: roundDimension(boardThicknessMm * factors.w),
    h: roundDimension(boardThicknessMm * factors.h),
  };
};

export const convertDimensionSet = ({
  inputDimensions,
  inputMode = "manufacture",
  boardThicknessMm = 3,
  fefcoCode = "0201",
  outerBufferFactor,
}) => {
  const normalizedInput = normalizeDimensions(inputDimensions);
  const thickness = clamp(toPositiveNumber(boardThicknessMm, 3), 0.2, 12);
  const manufactureAllowance = getStyleAllowance(fefcoCode, thickness);
  const outerBoardBuild = roundDimension(
    thickness * (outerBufferFactor || DEFAULT_MATERIAL.outerBufferFactor),
  );

  let innerDimensions;
  let manufacturingDimensions;

  if (inputMode === "inner") {
    innerDimensions = normalizedInput;
    manufacturingDimensions = {
      l: roundDimension(innerDimensions.l + manufactureAllowance.l),
      w: roundDimension(innerDimensions.w + manufactureAllowance.w),
      h: roundDimension(innerDimensions.h + manufactureAllowance.h),
    };
  } else {
    manufacturingDimensions = normalizedInput;
    innerDimensions = {
      l: roundDimension(Math.max(1, manufacturingDimensions.l - manufactureAllowance.l)),
      w: roundDimension(Math.max(1, manufacturingDimensions.w - manufactureAllowance.w)),
      h: roundDimension(Math.max(1, manufacturingDimensions.h - manufactureAllowance.h)),
    };
  }

  const outerDimensions = {
    l: roundDimension(innerDimensions.l + outerBoardBuild),
    w: roundDimension(innerDimensions.w + outerBoardBuild),
    h: roundDimension(innerDimensions.h + outerBoardBuild),
  };

  return {
    inputMode,
    boardThicknessMm: thickness,
    manufactureAllowance,
    innerDimensions,
    manufacturingDimensions,
    outerDimensions,
  };
};

export const buildPackagingSpec = ({
  productDimensions,
  fragility = "medium",
  material = "3ply",
  paddingMm = 0,
  fefcoCode = "0201",
}) => {
  const normalizedProduct = normalizeDimensions(productDimensions);
  const materialProfile = getMaterialProfile(material);
  const fragilityProfile = getFragilityProfile(fragility);
  const protectivePaddingMm = clamp(toPositiveNumber(paddingMm, 0), 0, 50);
  const insertionClearanceMm = fragilityProfile.insertionClearanceMm;

  const innerTargetDimensions = {
    l: roundDimension(
      normalizedProduct.l + (protectivePaddingMm + insertionClearanceMm) * 2,
    ),
    w: roundDimension(
      normalizedProduct.w + (protectivePaddingMm + insertionClearanceMm) * 2,
    ),
    h: roundDimension(
      normalizedProduct.h + (protectivePaddingMm + insertionClearanceMm) * 2,
    ),
  };

  const dimensionSet = convertDimensionSet({
    inputDimensions: innerTargetDimensions,
    inputMode: "inner",
    boardThicknessMm: materialProfile.boardThicknessMm,
    fefcoCode,
    outerBufferFactor: materialProfile.outerBufferFactor,
  });

  return {
    fefcoCode,
    fragility,
    productDimensions: normalizedProduct,
    material: materialProfile.id,
    materialLabel: materialProfile.label,
    boardGrade: materialProfile.boardGrade,
    boardThicknessMm: materialProfile.boardThicknessMm,
    insertionClearanceMm,
    protectivePaddingMm,
    recommendedPaddingMm: fragilityProfile.recommendedPaddingMm,
    fillerSuggestion: fragilityProfile.fillerSuggestion,
    ...dimensionSet,
  };
};

export const getNormalizedRenderDimensions = ({
  actualDimensions,
  defaultDimensions,
  minScale = 0.65,
  maxScale = 3.2,
}) => {
  const actual = normalizeDimensions(actualDimensions);
  const defaults = normalizeDimensions(defaultDimensions, actual);
  const ratios = [
    defaults.l / Math.max(actual.l, 1),
    defaults.w / Math.max(actual.w, 1),
    defaults.h / Math.max(actual.h, 1),
  ].filter(Number.isFinite);

  const scaleFactor = clamp(median(ratios), minScale, maxScale);

  return {
    scaleFactor: roundDimension(scaleFactor),
    dimensions: {
      l: roundDimension(actual.l * scaleFactor),
      w: roundDimension(actual.w * scaleFactor),
      h: roundDimension(actual.h * scaleFactor),
    },
  };
};
