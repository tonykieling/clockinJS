const express         = require("express");
const router          = express.Router();

const checkAuth       = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const userController  = require("../controllers/user.js");

// it logs the user into the system
// it's migrated
router.post("/login", userController.login);


// it creates an user account
// it's migrated
router.post("/signup", userController.signup);


// it returns all users
// not sure whether it is necessary right now. Maybe for an administration task which is not running rn
router.get("/", checkAuth, userController.get_all);


// it returns info about a particular user
// not sure whether it is necessary right now. Maybe for an administration task which is not running rn
router.get("/:userId", checkAuth, userController.get_one);


// it modifies user's data
// it's migrated
router.patch("/:userId", checkAuth, userController.modify_user);


// it deletes a user account
// not sure whether it is necessary right now. Maybe for an administration task which is not running rn
router.delete("/:userId", checkAuth, userController.delete_user);


// forget password method caller
// has been migrated
router.post("/forgetPassword", userController.forget_password);


// reset password method caller
router.post("/reset_password/:code", userController.reset_password);


// get user by code method caller
router.get("/get_by_code/:code", userController.get_by_code);


module.exports = router;