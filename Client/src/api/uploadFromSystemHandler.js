import apiClient from "@/lib/apiClient";

const uploadFromSystemHandler = async ({
  topImage,
  sideImage,
  referenceType,
  sessionId,
}) =>
{
  
  const formData = new FormData();
  formData.append("img1", topImage);
  formData.append("img2", sideImage);
  formData.append("referenceObject", referenceType);
  formData.append("sessionId", sessionId);

  const res = await apiClient.post("/api/img/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // console.log(res);
  console.log("Iam into the api this is not")

  return res;
};

export default uploadFromSystemHandler;
