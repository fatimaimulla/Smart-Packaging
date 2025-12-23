import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import imgRouter from "./routes/imgRoutes.js";
import connectCloudinary from "./config/cloudinary.js";


const app = express();
await connectCloudinary();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/img",imgRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}!`);
});
