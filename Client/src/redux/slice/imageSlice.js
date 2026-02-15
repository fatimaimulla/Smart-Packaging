import { createSlice } from "@reduxjs/toolkit";

const IMAGE_SLICE = createSlice({
  name: "image",
  initialState: {
    topImageUrl: null,
    sideImageUrl: null,
    topImageDimensions: null,
    sideImageDimensions: null,
  },
  reducers: {
    setTopImageUrl: (state, action) => {
      state.topImage = action.payload;
    },
    setSideImageUrl: (state, action) => {
      state.sideImageUrl = action.payload;
    },
    setTopImageDimensions: (state, action) => {
      state.topImageDimensions = action.payload;
    },
    setSideImageDimensions: (state, action) => {
      state.sideImageDimensions = action.payload;
    },

    resetImageUrlState: (state) => {
      state.topImageUrl = null;
      state.sideImageUrl = null;
      state.topImageDimensions = null;
      state.sideImageDimensions = null;
    },
  },
});

export const {
  setSideImageUrl,
  setTopImageUrl,
  setSideImageDimensions,
  setTopImageDimensions,
  resetImageUrlState,
} = IMAGE_SLICE.actions;
export default IMAGE_SLICE.reducer;
