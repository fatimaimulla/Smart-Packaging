import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getAiResponse = async ({ imageUrl1, imageUrl2, dimensions }) => {
  const formData = new FormData();
  formData.append("imageUrl1", imageUrl1);
  formData.append("imageUrl2", imageUrl2);
  formData.append("dimensions", dimensions);
  const res = await axios.post(`${baseURL}/api/ai/generatebox`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);
  return res;
};
