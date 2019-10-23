const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's autorized
const ProductsController  = require("../controllers/products.js");

// list of all products
router.get("/", ProductsController.get_all);


// it returns info about a specific product
router.get("/:productId", ProductsController.get_one);


// creation product function
router.post("/", checkAuth, ProductsController.insert_product);


// it changes a specific product
router.patch("/:productId", checkAuth, ProductsController.modify_product);


// it deletes a specific product
router.delete("/:productId", checkAuth, ProductsController.delete_product);


module.exports = router;