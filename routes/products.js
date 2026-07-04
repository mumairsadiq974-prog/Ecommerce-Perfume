const express = require("express");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminOnly, upload.array("images", 10), createProduct);
router.put("/:id", authMiddleware, adminOnly, upload.array("images", 10), updateProduct);
router.delete("/:id", authMiddleware, adminOnly, deleteProduct);

module.exports = router;
