const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");
const {
  signupValidation,
  loginValidation,
} = require("../middlewares/inputValidation");
const router = express.Router();

router.post("/register", signupValidation, registerUser);

router.post("/login", loginValidation, loginUser);

router.get("/current", userAuth, currentUser);

router.get("/logout", userAuth, logoutUser);

module.exports = router;
