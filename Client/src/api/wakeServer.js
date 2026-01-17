import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;


const wake = async ( ) => {
  const res = await axios.get(`${baseURL}`);
  return res;
};

export default wake;