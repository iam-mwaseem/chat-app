import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import app from "./app.js";
import { server } from "./socket/socket.js";
mongoose.connect(process.env.DATABASE_LOCAL_URI).then(() => {
  console.log("Connected to MongoDb");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
