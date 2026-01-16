import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const getImageId = async ({ sessionId }) => {
  const res = await axios.get(`${baseURL}/api/img/image/${sessionId}`);
  console.log(res);
  return res;
};

export default getImageId;
