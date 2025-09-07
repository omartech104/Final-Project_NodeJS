const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB=require('./config/db');

require("dotenv").config();

const {getAllProducts, addProduct, deleteProduct}=require('./controllers/itemControllers');

const {getAllUsers, deleteUser, signup, signin}=require('./controllers/userController');

const authenticate = require('./middlewares/Authenticate');
const isAdmin = require('./middlewares/isAdmin');
const isSuperAdmin = require('./middlewares/isSuperAdmin');


const app = express()

// Use  middleware
app.use(express.json())
app.use(cors());

//connection with database	
connectDB()

//user Routes
app.get("/users", authenticate, isAdmin, getAllUsers); // Removed isSuperAdmin
app.delete("/user/:userId", authenticate, isSuperAdmin, deleteUser);

app.post("/signup", signup);

app.post("/signin/", signin);

// ======= products ENDPOINTS =====

app.post("/product", authenticate, isAdmin, addProduct); // Removed isSuperAdmin
app.get("/products", getAllProducts);
app.delete("/product/:productId", authenticate, isAdmin, deleteProduct); 


app.listen(3003, () => {
	console.log("I am listening in port 3003");
});





