import apiClient from "@/lib/apiClient";

export const signupStartRequest = (payload) =>
  apiClient.post("/api/auth/signup/start", payload);

export const signupVerifyRequest = (payload) =>
  apiClient.post("/api/auth/signup/verify", payload);

export const loginRequest = (payload) =>
  apiClient.post("/api/auth/login", payload);

export const googleAuthRequest = (payload) =>
  apiClient.post("/api/auth/google", payload);

export const logoutRequest = () => apiClient.post("/api/auth/logout");

export const meRequest = () => apiClient.get("/api/auth/me");
