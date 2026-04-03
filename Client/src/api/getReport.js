import apiClient from "@/lib/apiClient";

export const getReport = async ({ dimensions, aiData }) => {
  const res = await apiClient.post("/api/report/cost", {
    length: dimensions.l,
    width: dimensions.w,
    height: dimensions.h,
    productWeight: aiData.estimatedWeight,
    fragility: aiData.fragilityLevel,
    fefcoCode: aiData.recommendedFefcoBox,
  });
  console.log(res);
  return res;
};
