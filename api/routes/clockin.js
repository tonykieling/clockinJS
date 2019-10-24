const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clockinController   = require("../controllers/clockin.js");


// it returns all users
router.get("/", checkAuth, clockinController.get_all);


// it returns info about a particular user
router.get("/:clockinId", checkAuth, clockinController.get_one);


// it creates an user account
router.post("/", checkAuth, clockinController.clockin_add);


// // it logs the user into the system
// router.post("/login", clockinController.login);


// // it modifies user's data
// router.patch("/:userId", checkAuth, clockinController.modify_user);

// // // change password
// // router.patch("password")


// // it deletes a user account
// router.delete("/:userId", checkAuth, clockinController.delete_user);


module.exports = router;