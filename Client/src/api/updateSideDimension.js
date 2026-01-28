import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const updateTopDimension = async ({ sideView, sessionId }) => {
  const res = await axios.post(`${baseURL}/api/img/updateSide`, {
    sideView,
    sessionId,
  });
  console.log(res);
  return res;
};
