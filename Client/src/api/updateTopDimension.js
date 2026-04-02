import apiClient from "@/lib/apiClient";

export const updateTopDimension = async ({ topView, sessionId }) => {
  const res = await apiClient.post("/api/img/updatetop", {
    topView,
    sessionId,
  });
  console.log(res);
  return res;
};
