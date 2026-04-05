const FEFCO_FORMULAS = {
  Fefco0201: (l, w, h) => (2 * (l + w) + 43) * (2 * h + w + 10),
  Fefco0203: (l, w, h) => (2 * (l + w) + 45) * (2 * h + w + 20),
  Fefco0301: (l, w, h) => {
    const bottom = (2 * (l + w) + 43) * (2 * (h * 0.6) + w + 10);
    const top = (2 * (l + w + 6) + 43) * (2 * (h * 0.45) + w + 10);
    return bottom + top;
  },
  Fefco0401: (l, w, h) => (l + 2 * h + 30) * (w + 2 * h + 30),
  Fefco0427: (l, w, h) => (l + w + 2 * h + 50) * (w + h + 45),
};

const getMaxDimension = (dimensions) =>
  Math.max(dimensions.l, dimensions.w, dimensions.h);

const getMinDimension = (dimensions) =>
  Math.max(1, Math.min(dimensions.l, dimensions.w, dimensions.h));

const getFootprintRatio = (dimensions) => {
  const longerSide = Math.max(dimensions.l, dimensions.w);
  const shorterSide = Math.max(1, Math.min(dimensions.l, dimensions.w));
  return longerSide / shorterSide;
};

const getFefcoSuitabilityPenalty = (code, dimensions, fragility, metrics = {}) => {
  const maxDimension = metrics.maxDimension || getMaxDimension(dimensions);
  const footprintRatio = metrics.footprintRatio || getFootprintRatio(dimensions);
  const overallRatio = metrics.overallRatio || maxDimension / getMinDimension(dimensions);
  const totalWeightGrams = metrics.totalWeightGrams || 0;

  let penalty = 0;

  if (code === "Fefco0401") {
    penalty += Math.max(0, footprintRatio - 2.4) * 0.03;
    penalty += Math.max(0, overallRatio - 3.2) * 0.02;
    penalty += Math.max(0, (maxDimension - 420) / 420) * 0.015;
    penalty += Math.max(0, (totalWeightGrams - 1200) / 1200) * 0.01;
  }

  if (code === "Fefco0201") {
    penalty += Math.max(0, footprintRatio - 3.4) * 0.01;
  }

  if (code === "Fefco0301" && fragility === "low") {
    penalty += Math.max(0, (240 - maxDimension) / 240) * 0.005;
  }

  return Number(penalty.toFixed(4));
};

export const normalizeFefcoCode = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  return `Fefco${digits}`;
};

export const calculateBoardArea = (l, w, h, fefcoCode) => {
  const code = normalizeFefcoCode(fefcoCode) || "Fefco0201";
  const formula = FEFCO_FORMULAS[code] || FEFCO_FORMULAS.Fefco0201;
  return formula(l, w, h) / 1_000_000;
};

export const getEligibleFefcoCodes = (fragility = "low") => {
  switch (fragility) {
    case "high":
      return ["Fefco0203", "Fefco0301"];
    case "medium":
      return ["Fefco0201", "Fefco0203", "Fefco0301"];
    default:
      return ["Fefco0201", "Fefco0203", "Fefco0401"];
  }
};

export const selectBestFefcoForBundle = (dimensions, fragility, metrics = {}) => {
  const eligibleCodes = getEligibleFefcoCodes(fragility);
  const ranked = eligibleCodes
    .map((code) => ({
      code,
      boardArea: calculateBoardArea(dimensions.l, dimensions.w, dimensions.h, code),
      suitabilityPenalty: getFefcoSuitabilityPenalty(
        code,
        dimensions,
        fragility,
        metrics,
      ),
    }))
    .map((entry) => ({
      ...entry,
      selectionScore: Number(
        (entry.boardArea + entry.suitabilityPenalty).toFixed(4),
      ),
    }))
    .sort((left, right) => left.selectionScore - right.selectionScore);

  const best = ranked[0] || {
    code: "Fefco0201",
    boardArea: calculateBoardArea(
      dimensions.l,
      dimensions.w,
      dimensions.h,
      "Fefco0201",
    ),
    suitabilityPenalty: 0,
    selectionScore: calculateBoardArea(
      dimensions.l,
      dimensions.w,
      dimensions.h,
      "Fefco0201",
    ),
  };

  return {
    fefcoCode: best.code,
    selectedTemplateId: best.code.replace(/\D/g, ""),
    boardArea: best.boardArea,
    suitabilityPenalty: best.suitabilityPenalty,
    selectionScore: best.selectionScore,
    eligibleCodes,
  };
};
