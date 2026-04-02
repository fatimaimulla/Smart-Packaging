import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  googleAuthRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  signupStartRequest,
  signupVerifyRequest,
} from "@/api/auth";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await meRequest();
      return res.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch session."));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await loginRequest(payload);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to log in."));
    }
  },
);

export const startSignup = createAsyncThunk(
  "auth/startSignup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await signupStartRequest(payload);
      return {
        email: res.data.email,
        name: payload.name,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to start signup."));
    }
  },
);

export const verifySignup = createAsyncThunk(
  "auth/verifySignup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await signupVerifyRequest(payload);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to verify OTP."));
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await googleAuthRequest(payload);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to sign in with Google."),
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutRequest();
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to log out."));
    }
  },
);

const AUTH_SLICE = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    bootstrapped: false,
    pendingSignupEmail: "",
    pendingSignupName: "",
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearPendingSignup: (state) => {
      state.pendingSignupEmail = "";
      state.pendingSignupName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.bootstrapped = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "unauthenticated";
        state.bootstrapped = true;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.bootstrapped = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.bootstrapped = true;
        state.error = action.payload;
      })
      .addCase(startSignup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(startSignup.fulfilled, (state, action) => {
        state.status = "awaiting_verification";
        state.pendingSignupEmail = action.payload.email;
        state.pendingSignupName = action.payload.name || "";
      })
      .addCase(startSignup.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload;
      })
      .addCase(verifySignup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifySignup.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.bootstrapped = true;
        state.user = action.payload;
        state.pendingSignupEmail = "";
        state.pendingSignupName = "";
      })
      .addCase(verifySignup.rejected, (state, action) => {
        state.status = "awaiting_verification";
        state.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.bootstrapped = true;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.bootstrapped = true;
        state.pendingSignupEmail = "";
        state.pendingSignupName = "";
      });
  },
});

export const { clearAuthError, clearPendingSignup } = AUTH_SLICE.actions;

export default AUTH_SLICE.reducer;
