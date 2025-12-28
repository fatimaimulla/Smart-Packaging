import { createSlice } from "@reduxjs/toolkit";

const MOBILE_UPLOAD_SLICE = createSlice({
  name: "mobileUpload",
  initialState: {
    topView: null,
    sideView: null,
  },
  reducers: {
    setTopView: (state, action) => {
      state.topView = action.payload;
    },
    setSideView: (state, action) => {
      state.sideView = action.payload;
    },
  },
});

export const { setTopView, setSideView } = MOBILE_UPLOAD_SLICE.actions;
export default MOBILE_UPLOAD_SLICE.reducer;
