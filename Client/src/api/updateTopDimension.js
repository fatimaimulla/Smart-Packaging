import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const updateTopDimension = async ({ topView, sessionId }) => {
  const res = await axios.post(`${baseURL}/api/img/updateTop`, {
    topView,
    sessionId,
  });
  console.log(res);
  return res;
};
