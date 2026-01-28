import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getSideDimension = async ({ sessionId }) => {
  const res = await axios.get(`${baseURL}/api/img/getside/${sessionId}`);
  console.log(res);
  return res;
};
