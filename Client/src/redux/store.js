import { configureStore } from "@reduxjs/toolkit";
import mobileUploadReducer from "./slice/mobileUploadSlice";
import dimensionReducer from "./slice/dimensionSlice";

const store = configureStore({
  reducer: {
    mobileUpload: mobileUploadReducer,
    dimension: dimensionReducer,
  },
});

export default store;
