const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nameOfProduct: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String , required: true},
  
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
