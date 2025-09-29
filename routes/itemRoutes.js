const express = require("express");
const router = express.Router();

const { getAllProducts, addProduct, deleteProduct } = require("../controllers/itemControllers");
const authenticate = require("../middlewares/Authenticate");
const isAdmin = require("../middlewares/isAdmin");

// Product routes
router.get("/products", getAllProducts);
router.post("/product", authenticate, isAdmin, addProduct);
router.delete("/product/:productId", authenticate, isAdmin, deleteProduct);

module.exports = router;

