import { createSlice } from "@reduxjs/toolkit";

const IMAGE_SLICE = createSlice({
  name: "image",
  initialState: {
    topImageUrl: null,
    sideImageUrl: null,
    dimensions: {},
    aiResponse: {},
  },
  reducers: {
    setTopImageUrl: (state, action) => {
      state.topImageUrl = action.payload;
    },
    setSideImageUrl: (state, action) => {
      state.sideImageUrl = action.payload;
    },
    setImageDimensions: (state, action) => {
      state.dimensions = action.payload;
    },
    setAiResponse: (state, action) => {
      state.aiResponse = action.payload;
    },

    resetImageUrlState: (state) => {
      state.topImageUrl = null;
      state.sideImageUrl = null;
      state.dimensions = {};
      state.aiResponse = {};
    },
  },
});

export const {
  setSideImageUrl,
  setTopImageUrl,
  setImageDimensions,
  resetImageUrlState,
  setAiResponse,
} = IMAGE_SLICE.actions;
export default IMAGE_SLICE.reducer;
