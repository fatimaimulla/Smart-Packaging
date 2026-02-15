import { combineReducers, configureStore } from "@reduxjs/toolkit";
import mobileUploadReducer from "./slice/mobileUploadSlice";
import dimensionReducer from "./slice/dimensionSlice";
import imageReducer from "./slice/imageSlice";
import {
  // persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  mobileUpload: mobileUploadReducer,
  dimension: dimensionReducer,
  image: imageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // reducer: {
  //   mobileUpload: mobileUploadReducer,
  //   dimension: dimensionReducer,
  // },
});

export default store;
