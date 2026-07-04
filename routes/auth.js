const express = require("express");
const { login, getMe, changePassword } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
