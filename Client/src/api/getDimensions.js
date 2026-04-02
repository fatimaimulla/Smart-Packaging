import apiClient from "@/lib/apiClient";

export const getDimensions = async ({ sessionId }) => {
  const res = await apiClient.get(`/api/img/getdimensions/${sessionId}`);
  console.log(res);
  return res;
};
