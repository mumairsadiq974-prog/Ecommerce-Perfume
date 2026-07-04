const express = require("express");
const { addReview, getReviewsByProduct, deleteReview, getAllReviews, getPublicReviews } = require("../controllers/reviewController");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();


router.get("/product/:productId", getReviewsByProduct);
router.post("/product/:productId", addReview);
router.get("/public", getPublicReviews);


router.get("/", authMiddleware, adminOnly, getAllReviews);
router.delete("/:id", authMiddleware, adminOnly, deleteReview);

module.exports = router;
