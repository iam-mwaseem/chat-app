import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.signout);

export default router;
