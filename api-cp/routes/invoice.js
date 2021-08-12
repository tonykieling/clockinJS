const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const invoiceController   = require("../controllers/invoice.js");


// it returns all users
router.get("/", checkAuth, invoiceController.get_all);
//TK migration is done


// it returns info about a particular user
router.get("/:invoiceId", checkAuth, invoiceController.get_one);


// it creates an user account
router.post("/", checkAuth, invoiceController.invoice_add);
//TK// migration is done


// it modifies invoice's data
router.patch("/edit", checkAuth, invoiceController.invoice_edit);


// it modifies invoice's status
router.patch("/:invoiceId", checkAuth, invoiceController.invoice_modify_status);


// it deletes a user account
router.delete("/:invoiceId", checkAuth, invoiceController.invoice_delete);
//TK// migration is done


module.exports = router;