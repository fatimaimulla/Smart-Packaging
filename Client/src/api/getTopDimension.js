import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getTopDimension = async ({ sessionId }) => {
  const res = await axios.get(`${baseURL}/api/img/gettop/${sessionId}`);
  console.log(res);
  return res;
};
