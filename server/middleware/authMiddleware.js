import User from "../model/userSchema.js";
import { getAuthCookieName, verifyAuthToken } from "../utils/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[getAuthCookieName()];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session is no longer valid.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
};
