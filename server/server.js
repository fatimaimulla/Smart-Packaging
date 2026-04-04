import express from "express";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import imgRouter from "./routes/imgRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import aiRouter from "./routes/aiRoutes.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import reportRouter from "./routes/reportRoutes.js";


const app = express();
const server = http.createServer(app);
await connectCloudinary();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/auth", authRouter);
app.use("/api/projects", requireAuth, projectRouter);
app.use("/api/img", imgRouter);
app.use("/api/ai", aiRouter);
app.use("/api/report", reportRouter);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const sessionConnections = new Map();

const getSessionState = (sessionId) => {
  if (!sessionConnections.has(sessionId)) {
    sessionConnections.set(sessionId, {
      desktopSocketIds: new Set(),
      mobileSocketIds: new Set(),
    });
  }

  return sessionConnections.get(sessionId);
};

const emitSessionStatus = (sessionId) => {
  const sessionState = sessionConnections.get(sessionId);

  io.to(sessionId).emit("mobile-session-status", {
    sessionId,
    mobileConnected: !!sessionState?.mobileSocketIds?.size,
  });
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join-session", (payload) => {
    const sessionId =
      typeof payload === "string" ? payload : payload?.sessionId;
    const role =
      typeof payload === "string" ? "desktop" : payload?.role || "desktop";

    if (!sessionId) {
      return;
    }

    socket.join(sessionId);
    socket.data.sessionId = sessionId;
    socket.data.role = role;

    const sessionState = getSessionState(sessionId);
    if (role === "mobile") {
      sessionState.mobileSocketIds.add(socket.id);
    } else {
      sessionState.desktopSocketIds.add(socket.id);
    }

    console.log("joined session", sessionId);
    emitSessionStatus(sessionId);
  });

  socket.on("mobile-upload-complete", (sessionId) => {
    console.log("mobile upload complete", sessionId);
    io.to(sessionId).emit("mobile-upload-complete");
  });

  socket.on("desktop-end-mobile-session", (sessionId) => {
    if (!sessionId) {
      return;
    }

    const sessionState = sessionConnections.get(sessionId);
    const mobileSocketIds = [...(sessionState?.mobileSocketIds || [])];

    io.to(sessionId).emit("mobile-session-ended");

    mobileSocketIds.forEach((socketId) => {
      const mobileSocket = io.sockets.sockets.get(socketId);
      if (mobileSocket) {
        mobileSocket.disconnect(true);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const sessionId = socket.data?.sessionId;
    const role = socket.data?.role;

    if (!sessionId || !role) {
      return;
    }

    const sessionState = sessionConnections.get(sessionId);
    if (!sessionState) {
      return;
    }

    if (role === "mobile") {
      sessionState.mobileSocketIds.delete(socket.id);
    } else {
      sessionState.desktopSocketIds.delete(socket.id);
    }

    if (
      sessionState.mobileSocketIds.size === 0 &&
      sessionState.desktopSocketIds.size === 0
    ) {
      sessionConnections.delete(sessionId);
      return;
    }

    emitSessionStatus(sessionId);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}!`);
});
