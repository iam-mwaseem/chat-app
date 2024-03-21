import express from "express";
import { app } from "./socket/socket.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import protect from "./middleware/authMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";

// const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use("/api/v1/auth", authRoutes);
app.use(protect);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

app.use(globalErrorHandler);

export default app;
