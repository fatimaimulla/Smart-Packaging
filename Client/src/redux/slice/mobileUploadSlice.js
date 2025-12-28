import { createSlice } from "@reduxjs/toolkit";

const MOBILE_UPLOAD_SLICE = createSlice({
  name: "mobileUpload",
  initialState: {
    topImage: null,
    sideImage: null,
  },
  reducers: {
    setTopImage: (state, action) => {
      state.topImage = action.payload;
    },
    clearTopImage: (state) => {
      state.topImage = null;
    },
    setSideImage: (state, action) => {
      state.sideImage = action.payload;
    },
    clearSideImage: (state) => {
      state.sideImage = null;
    },
    resetState: (state) => {
      state.topImage = null;
      state.sideImage = null;
    },
  },
});

export const { setTopImage, setSideImage, resetState, clearTopImage, clearSideImage } = MOBILE_UPLOAD_SLICE.actions;
export default MOBILE_UPLOAD_SLICE.reducer;
