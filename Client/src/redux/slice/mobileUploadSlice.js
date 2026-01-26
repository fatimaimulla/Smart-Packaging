import { createSlice } from "@reduxjs/toolkit";

const MOBILE_UPLOAD_SLICE = createSlice({
  name: "mobileUpload",
  initialState: {
    sessionId: null,
    referenceObject: null, // 'coin', 'card', 'marker'
    imageId: null,
    topImage: null,
    sideImage: null,
    uploadStatus: "idle", // 'idle', 'uploading', 'success', 'error'
  },
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setImageId: (state, action) => {
      state.imageId = action.payload;
    },
    setReferenceObject: (state, action) => {
      state.referenceObject = action.payload;
    },
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
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    },
    resetUploadState: (state) => {
      state.sessionId = null;
      state.referenceObject = null;
      state.imageId = null;
      state.topImage = null;
      state.sideImage = null;
      state.uploadStatus = "idle";
    },
  },
});

export const {
  setSessionId,
  setImageId,
  setReferenceObject,
  setTopImage,
  setSideImage,
  resetUploadState,
  clearTopImage,
  clearSideImage,
  setUploadStatus,
} = MOBILE_UPLOAD_SLICE.actions;
export default MOBILE_UPLOAD_SLICE.reducer;
