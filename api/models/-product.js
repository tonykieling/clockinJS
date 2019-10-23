// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { 
    type: String, 
    required: true },
  price: { 
    type: Number, 
    required: true }
});

module.exports = mongoose.model("Product", productSchema);
