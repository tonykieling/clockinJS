const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clockinController   = require("../controllers/clockin.js");


// it returns all users
// router.get("/", clockinController.get_all);
router.get("/", checkAuth, clockinController.get_all);


// it returns info about a particular clockin
router.get("/:clockinId", checkAuth, clockinController.get_one);


// // it returns info about a particular set of clockins, regarding a specific invoice
// router.get("/clockinInvoice", checkAuth, clockinController.get_clockins_by_invoice);


// it creates an user account
// router.post("/", clockinController.clockin_add);
router.post("/", checkAuth, clockinController.clockin_add);


// // it logs the user into the system
// router.post("/login", clockinController.login);


// // it modifies user's data
// router.patch("/:userId", checkAuth, clockinController.modify_user);

// // // change password
// // router.patch("password")


// it deletes a user account
// router.delete("/:clockinId", checkAuth, clockinController.clockin_delete);
router.delete("/", checkAuth, clockinController.clockin_delete);


module.exports = router;