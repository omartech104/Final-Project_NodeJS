const express = require("express");
const router = express.Router();

const { getAllUsers, deleteUser, signup, signin } = require("../controllers/userController");
const authenticate = require("../middlewares/Authenticate");
const isAdmin = require("../middlewares/isAdmin");
const isSuperAdmin = require("../middlewares/isSuperAdmin");

// Auth routes
router.post("/signup", signup);
router.post("/signin", signin);

// User management routes
router.get("/users", authenticate, isAdmin, getAllUsers);
router.delete("/user/:userId", authenticate, isSuperAdmin, deleteUser);

module.exports = router;

