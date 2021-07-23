const express         = require("express");
const router          = express.Router();

const checkAuth       = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const userController  = require("../controllers/user.js");

// it logs the user into the system
router.post("/login", userController.login);


// it creates an user account
router.post("/signup", userController.signup);


// it returns all users
router.get("/", checkAuth, userController.get_all);


// it returns info about a particular user
router.get("/:userId", checkAuth, userController.get_one);


// it modifies user's data
router.patch("/:userId", checkAuth, userController.modify_user);


// it deletes a user account
router.delete("/:userId", checkAuth, userController.delete_user);


// forget password method caller
router.post("/forgetPassword", userController.forget_password);

// get user by code method caller
router.get("/get_by_code/:code", userController.get_by_code);

// reset password method caller
router.post("/reset_password/:code", userController.reset_password);


module.exports = router;