import apiClient from "@/lib/apiClient";

export const updateSideDimension = async ({ sideView, sessionId }) => {
  const res = await apiClient.post("/api/img/updateside", {
    sideView,
    sessionId,
  });
  console.log(res);
  return res;
};
