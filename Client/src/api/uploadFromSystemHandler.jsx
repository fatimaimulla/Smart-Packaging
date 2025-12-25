import axios from "axios";

axios.defaults.baseURL = process.env.SERVER_URL;
export const uploadFromSystemHandler = async ({
  topImage,
  sideImage,
  rreferenceObject,
}) => {
  try {
    const formData = new FormData();
    formData.append("img1", topImage);
    formData.append("img2", sideImage);
    formData.append("referenceObject", rreferenceObject);

    const res = await axios.post(`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
  } catch (error) {}
};
