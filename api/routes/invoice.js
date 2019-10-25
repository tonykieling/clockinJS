const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const invoiceController   = require("../controllers/invoice.js");


// it returns all users
router.get("/", checkAuth, invoiceController.get_all);


// it returns info about a particular user
router.get("/:invoiceId", checkAuth, invoiceController.get_one);


// it creates an user account
router.post("/", checkAuth, invoiceController.invoice_add);


// // it logs the user into the system
// router.post("/login", invoice.login);


// // it modifies user's data
// router.patch("/:userId", checkAuth, invoice.modify_user);

// // // change password
// // router.patch("password")


// it deletes a user account
router.delete("/:invoiceId", checkAuth, invoiceController.invoice_delete);


module.exports = router;