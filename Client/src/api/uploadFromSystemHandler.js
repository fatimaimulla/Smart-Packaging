import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// axios.defaults.baseURL = process.env.VITE_API_BASE_URL;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const uploadFromSystemHandler = async ({
  topImage,
  sideImage,
  referenceType,
}) => {
  const formData = new FormData();
  formData.append("img1", topImage);
  formData.append("img2", sideImage);
  formData.append("referenceObject", referenceType);

  const res = await axios.post(`${baseURL}/api/img/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res);

  return res;
};

export default uploadFromSystemHandler;
