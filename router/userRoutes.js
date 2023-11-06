import express from "express";
import {
  getMyProfile,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("working");
// });
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/logout").get(isAuthenticated, logout);

export default router;
