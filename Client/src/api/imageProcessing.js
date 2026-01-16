import axios from "axios";
// const umair = "http://127.0.0.1:8000/detect";
const imageApi = "http://10.0.9.5:8000/detect";

export const imageProcessing = async ({ croppedImage }) => {
  const formData = new FormData();
  formData.append("file", croppedImage);
  const res = await axios.post(`${imageApi}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};
