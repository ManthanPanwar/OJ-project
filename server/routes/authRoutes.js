const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  signupValidation,
  loginValidation,
} = require("../middlewares/inputValidation");
const router = express.Router();

router.post("/register", signupValidation, registerUser);

router.post("/login", loginValidation, loginUser);

router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
