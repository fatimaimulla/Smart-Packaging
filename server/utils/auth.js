import crypto from "crypto";
import jwt from "jsonwebtoken";

const AUTH_COOKIE_NAME = "smartpack_session";

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export const generateOtp = () =>
  String(crypto.randomInt(0, 1000000)).padStart(6, "0");

export const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

export const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET || "smartpack-dev-secret",
    {
      expiresIn: "7d",
    },
  );

export const verifyAuthToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || "smartpack-dev-secret");

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: SESSION_MAX_AGE_MS,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

export const getAuthCookieName = () => AUTH_COOKIE_NAME;
