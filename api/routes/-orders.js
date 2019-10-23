const express           = require("express");
const router            = express.Router();

const OrdersController  = require("../controllers/orders.js");
const checkAuth         = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized

// it returns info about all orders
router.get("/", checkAuth, OrdersController.get_all);

// it returns info about a specific order
router.get("/:orderId", checkAuth, OrdersController.get_one);

// creation order function
router.post("/", checkAuth, OrdersController.create_order);

// it deletes a specific order
router.delete("/:orderId", checkAuth, OrdersController.delete_order);

module.exports = router;