import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import imgRouter from "./routes/imgRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();
const server = http.createServer(app);
await connectCloudinary();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/img", imgRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log("joined session", sessionId);
  });

  socket.on("mobile-upload-complete", (sessionId) => {
    console.log("mobile upload complete", sessionId);
    io.to(sessionId).emit("mobile-upload-complete");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}!`);
});
