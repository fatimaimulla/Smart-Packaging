import apiClient from "@/lib/apiClient";

const normalizeDimensions = (dimensions = {}) => ({
  length: Number(dimensions?.l ?? dimensions?.length ?? 0),
  width: Number(dimensions?.w ?? dimensions?.width ?? 0),
  height: Number(dimensions?.h ?? dimensions?.height ?? 0),
});

const normalizeFragility = (fragility) => {
  if (typeof fragility !== "string" || !fragility.trim()) {
    return undefined;
  }

  const normalized = fragility.trim().toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeFefcoCode = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const trimmed = value.trim();
  if (/^fefco/i.test(trimmed)) {
    const digits = trimmed.replace(/\D/g, "");
    return digits ? `Fefco${digits}` : trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits ? `Fefco${digits}` : trimmed;
};

export const getReport = async ({ dimensions, aiData }) => {
  const normalizedDimensions = normalizeDimensions(dimensions);
  const productWeight = aiData?.estimatedWeight ?? aiData?.productWeight;
  const fragility =
    normalizeFragility(aiData?.fragilityLevel ?? aiData?.fragility) ?? "Low";
  const fefcoCode = normalizeFefcoCode(
    aiData?.recommendedFefcoBox ??
      aiData?.fefcoCode ??
      aiData?.selectedTemplateId,
  );

  const res = await apiClient.post("/api/report/cost", {
    ...normalizedDimensions,
    productWeight,
    fragility,
    fefcoCode,
  });
  console.log(res);
  return res;
};
