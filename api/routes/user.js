const express         = require("express");
const router          = express.Router();

const checkAuth       = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const userController  = require("../controllers/user.js");


// it returns all users
router.get("/", checkAuth, userController.get_all);


// it returns info about a particular user
router.get("/:userId", checkAuth, userController.get_one);


// it creates an user account
router.post("/signup", userController.signup);


// it logs the user into the system
router.post("/login", userController.login);


// it modifies user's data
router.patch("/:userId", checkAuth, userController.modify_user);

// // change password
// router.patch("password")


// it deletes a user account
router.delete("/:userId", checkAuth, userController.delete_user);


// ofrget password method caller
router.post("/forgetPassword", userController.forget_password);
router.post("/resetPassword", userController.reset_password);

module.exports = router;