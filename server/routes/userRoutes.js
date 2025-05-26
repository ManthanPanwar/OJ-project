const express = require("express");
const router = express.Router();
const {
  currentUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, currentUser);

module.exports = router;
