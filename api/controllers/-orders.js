const mongoose  = require("mongoose");

const Order     = require("../models/order.js");
const Product   = require("../models/product.js");

// it returns info about all orders
get_all = async (req, res) => {
  try {
    const docs = await Order
      .find()
      .select('_id productId quantity')
      .populate('productId', 'name');

    res.status(200).json({ 
      Count   : docs.length,
      orders  : docs.map(doc => {
        return({
          OrderId   : doc._id,
          ProductId : doc.productId,
          Qtd       : doc.quantity,
          request   : {
            type  : "GET",
            url   : `http://localhost:3333/orders/${doc._id}`
          }
        });
      })
    });
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(500).json({
      error: "Something bad"
    });
  }
};


// it gets info about a particular order
get_one = async (req, res) => {
  const id = req.params.orderId;

  try {
    const order = await Order
      .findOne({ _id: id})
      .select(" _id productId quantity")
      .populate("productId", "name");

    if (!order)
      return res.status(401).json({
        error: `Order <${id} not found.`
      });

    res.json({
      id        : order._id,
      productId : order.productId,
      quantity  : order.quantity,
      request: {
        type  : "GET",
        url   : `http://localhost:3333/orders/${order._id}`
      }
    });
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(500).json({ 
      error: "Something bad!!"
    });
  }
}


// it creates an order
create_order = async (req, res) => {
  const productId = req.body.productId;
  const quantity  = req.body.quantity;

  //before save an order, need to check if the product ordered exists
  try {
    const product = await Product
      .find({_id : productId});

    if (product.length < 1)
      return res.json({
        error: "Product is invalid"
      })
  } catch (err) {
    console.trace("Error => ", err.message);
    return res.status(500).json({ 
      error: "Something VERY bad"
    });
  }

  try {
    const order = new Order ({
      _id: mongoose.Types.ObjectId(),
      productId,
      quantity
    });
    
    await order.save();

    res.status(201).json({
      message: "Order created",
      order
    });
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(500).json({ 
      error: "Something bad"
    });
  }
}


// it delets a particular order
delete_order = async (req, res) => {
  const id = req.params.orderId;

  try {
    const deleteOrder = await Order.deleteOne({_id: id});

    if (deleteOrder.deletedCount)
      return res.status(200).json({
        message: `Order ${id} has been deleted`
      });
    else
      return res.json({
        message: `Order ${id} not found`
      });
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(404).json({
      error: `Something bad with id - ${id}`
    })
  }
}

module.exports = {
  get_all,
  get_one,
  create_order,
  delete_order
};