import express from "express";
import {
  createUser,
  getAllUsers,
  login_otp,
  sendOTP,
  updatePassword,
  updatePasswordOTP,
  updateUserName,
  userLogin,
} from "../controllers/userContoller.js";
import { verifyJWToken } from "../middlewares/jwtAuth.js";
import { validateOTP } from "../middlewares/validateOTP.js";

const router = express.Router();

router.get("/all", verifyJWToken, getAllUsers);
router.post("/register", createUser);
router.post("/login", userLogin);
router.patch("/update-password/:userName", verifyJWToken, updatePassword);
router.patch("/update-userName/:userName", verifyJWToken, updateUserName);
router.patch("/send-otp", sendOTP);
router.post("/login-otp", validateOTP, login_otp);
router.patch("/forgot-password-otp/:email", verifyJWToken, updatePasswordOTP);

export default router;
