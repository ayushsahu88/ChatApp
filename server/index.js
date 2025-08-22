import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import messageRouter from "./routes/message.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://chatapp-l1er.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});
