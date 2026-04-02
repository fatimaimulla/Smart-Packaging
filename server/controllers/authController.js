import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import PendingSignup from "../model/pendingSignupSchema.js";
import User from "../model/userSchema.js";
import {
  clearAuthCookie,
  generateOtp,
  hashOtp,
  setAuthCookie,
  signAuthToken,
} from "../utils/auth.js";
import { sendOtpEmail } from "../utils/mailer.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  isVerified: user.isVerified,
  authProviders: user.authProviders,
});

export const signupStart = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PendingSignup.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: name?.trim() || "SmartPack User",
          email: normalizedEmail,
          passwordHash,
          otpHash,
          expiresAt,
        },
        $inc: { resendCount: 1 },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    await sendOtpEmail({
      email: normalizedEmail,
      otp,
      name: name?.trim() || "SmartPack User",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Signup start error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to start signup.",
    });
  }
};

export const signupVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const pendingSignup = await PendingSignup.findOne({ email: normalizedEmail });

    if (!pendingSignup || pendingSignup.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or expired.",
      });
    }

    if (pendingSignup.otpHash !== hashOtp(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or expired.",
      });
    }

    const user = await User.create({
      name: pendingSignup.name,
      email: pendingSignup.email,
      passwordHash: pendingSignup.passwordHash,
      isVerified: true,
      authProviders: ["password"],
    });

    await PendingSignup.deleteOne({ _id: pendingSignup._id });

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Signup verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify signup.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!email || !payload?.sub) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify Google account.",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload.name || "SmartPack User",
        email,
        googleId: payload.sub,
        avatarUrl: payload.picture || null,
        isVerified: true,
        authProviders: ["google"],
      });
    } else {
      user.googleId = user.googleId || payload.sub;
      user.avatarUrl = user.avatarUrl || payload.picture || null;
      user.isVerified = true;
      user.authProviders = Array.from(
        new Set([...(user.authProviders || []), "google"]),
      );
      await user.save();
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Signed in with Google.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to sign in with Google.",
    });
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

export const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};
