// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true},
  quantity: { 
    type: Number, 
    default: 1 }  // if not received, it will have a default as 1
});

module.exports = mongoose.model("Order", orderSchema);
