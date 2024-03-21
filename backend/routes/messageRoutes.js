import express from "express";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.post("/sendmessage/:id", messageController.sendMessage);
router.get("/getmessages/:id", messageController.getMessages);

export default router;
