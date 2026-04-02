import apiClient from "@/lib/apiClient";

export const getSideDimension = async ({ sessionId }) => {
  const res = await apiClient.get(`/api/img/getside/${sessionId}`);
  console.log(res);
  return res;
};
