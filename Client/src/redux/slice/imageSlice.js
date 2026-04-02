import { createSlice } from "@reduxjs/toolkit";

const IMAGE_SLICE = createSlice({
  name: "image",
  initialState: {
    topImageUrl: null,
    sideImageUrl: null,
    dimensions: {},
    aiResponse: {},
    aiResponseSessionId: null,
    currentProjectSessionId: null,
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
      const payload = action.payload;

      if (
        payload &&
        typeof payload === "object" &&
        Object.prototype.hasOwnProperty.call(payload, "data")
      ) {
        state.aiResponse = payload.data || {};
        state.aiResponseSessionId = payload.sessionId || null;
        return;
      }

      state.aiResponse = payload;
      state.aiResponseSessionId = null;
    },
    setCurrentProjectSessionId: (state, action) => {
      state.currentProjectSessionId = action.payload;
    },

    resetImageUrlState: (state) => {
      state.topImageUrl = null;
      state.sideImageUrl = null;
      state.dimensions = {};
      state.aiResponse = {};
      state.aiResponseSessionId = null;
      state.currentProjectSessionId = null;
    },
  },
});

export const {
  setSideImageUrl,
  setTopImageUrl,
  setImageDimensions,
  resetImageUrlState,
  setAiResponse,
  setCurrentProjectSessionId,
} = IMAGE_SLICE.actions;
export default IMAGE_SLICE.reducer;
