const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const itemsRoutes = require("./routes/itemRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Use routes
app.use("/", userRoutes);
app.use("/", itemsRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

