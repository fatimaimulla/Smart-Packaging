import { createSlice } from "@reduxjs/toolkit";

const DIMENSION_SLICE = createSlice({
  name: "dimension",
  initialState: {
    topView: {
      referenceObject: [],
      product: [],
    },
    SideView: {
      referenceObject: [],
      product: [],
    },
  },

  reducers: {
    setTopViewReferenceDimension: (state, action) => {
      state.topView.referenceObject = action.payload;
    },
    setTopViewProductDimension: (state, action) => {
      state.topView.product = action.payload;
    },
    setSideViewReferenceDimension: (state, action) => {
      state.SideView.referenceObject = action.payload;
    },
    setSideViewProductDimension: (state, action) => {
      state.SideView.product = action.payload;
    },
    clearTopViewDimension: (state) => {
      state.topView = [];
    },
    clearSideViewDimension: (state) => {
      state.SideView = [];
    },
    resetDimensionState: (state) => {
      state.topView = {
        referenceObject: [],
        product: [],
      };
      state.SideView = {
        referenceObject: [],
        product: [],
      };
    },
  },
});

export const {
  setTopViewReferenceDimension,
  setTopViewProductDimension,
  setSideViewReferenceDimension,
  setSideViewProductDimension,
  clearTopViewDimension,
  clearSideViewDimension,
  resetDimensionState
} = DIMENSION_SLICE.actions;
export default DIMENSION_SLICE.reducer;
