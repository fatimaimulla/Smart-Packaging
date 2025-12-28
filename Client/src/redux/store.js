import { configureStore } from "@reduxjs/toolkit";
import mobileUploadReducer from "./slice/mobileUploadSlice";

const store = configureStore({
  reducer: {
    mobileUpload: mobileUploadReducer,
  },
});

export default store;
