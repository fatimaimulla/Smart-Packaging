import apiClient from "@/lib/apiClient";

const getImageId = async ({ sessionId }) => {
  const res = await apiClient.get(`/api/img/image/${sessionId}`);
  console.log(res);
  return res;
};

export default getImageId;
