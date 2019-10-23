const mongoose  = require("mongoose");
const Product   = require("../models/product.js");

// description: function to search and answer for all products
// requeriments: none
// method: GET
// uri: /products
// input: none
// output: it returns data about all products
//      1- Counter
//      2- allProducts which is a list of all products with 
//        _id,
//        name
//        price
get_all = async (req, res) => {
  try {
    const allProducts = await Product
      .find()
      .select("_id name price");

    res.json({"count": allProducts.length, allProducts});
  } catch (error) {
    console.trace("Error => ", err.message);
    res.status(500).json({ 
      error: error.message 
    });
  }
}


// description: it returns data regarding a particular product
// requirments: none
// method: GET
// uri: /products/<productId>
// input: product_id
// output: it returns
//      1- data about one product with
//        _id,
//        name
//        price
//      OR
//      .error when none product is found
get_one = async (req, res) => {
  const id = req.params.productId;

  try {
    const productInfo = await Product
      .findById(id)
      .select("_id name price");

    if (productInfo)
      res.status(200).json(productInfo);
    else
      res.status(404).json({ error: `Product <${id}> NOT found.`})
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(500).json({
      error: "Invalid id"
    });
  }
}


// description: function to insert a product into the system/database
// requirments: user has been authenticated
// method: POST
// uri: /products/
// input: 
//    name (String)
//    price (Number)
// output: it returns
//      1- data about one products with
//        _id,
//        name
//        price
//      OR
//      .error when none product is found
insert_product = async (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  try {
    const addProduct = await product.save();
    res.status(201).json(addProduct);
  } catch (err) {
    console.trace("Error => ", err.message);
    res.status(500).json({ 
      error: "Something wrong happend" 
    });
  }
}


// description: method to modify inform regarding a particular product
// requirments: user has been authenticated
// method: PATCH
// uri: /products/<productId>
// input: 
//    params  = productId
//    body    = name (String)
//    body    = price (Number)
// output: it returns
//      1- data about the modified products with
//        _id,
//        name
//        price
//      OR
//      .error when none product is found
modify_product = async (req, res) => {
  const id = req.params.productId;

  try {
    const result = await Product
    .updateOne({
       _id: id
      }, {
        $set: {
          name: req.body.name,
          price: req.body.price
        }
      });
    
    if (result.nModified) {
      const newProduct = await Product
        .find({_id: id})
        .select(" name price");

      return res.json(newProduct);
    } else
      res.json({
        error: `Product ${id} has NOT been updated`
      });
  } catch (err) {
    console.trace("Error => ", err.message);
    res.json({
      error: "Error Update"
    });
  }
}


// description: function that removes a given product
// requirments: user has been authorized
// method: DELETE
// uri: /products/<productId>
// input: product_id
// output: it returns
//      .message with success
//      OR
//      .error when none product is found
delete_product = async (req, res) => {
  const productId = req.params.productId;

  const productToBeDeleted = await Product.findById(productId);
  if (!productToBeDeleted || productToBeDeleted.length < 1)
    return res.status(409).json({
      error: "Product not found"
    });
  
  else {
    try {
      const result = await Product.deleteOne({_id: productId});

      if (result.deletedCount)
        return res.status(200).json({
          message: `Product ${productId} has been deleted`
        });
      else
        return res.json({
          message: `Product <${productId}> NOT found. `
        });
    } catch (err) {
      console.trace("Error => ", err.message);
      res.status(404).json({
        error: `Something bad with id - ${id}`
      });
    }
  }
}


module.exports = {
  get_all,
  get_one,
  insert_product,
  modify_product,
  delete_product
}