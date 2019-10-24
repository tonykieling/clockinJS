const express           = require("express");
const router            = express.Router();

const checkAuth         = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clientController  = require("../controllers/client.js");


// it returns all users
router.get("/", checkAuth, clientController.get_all);


// it returns info about a particular user
router.get("/:clientId", checkAuth, clientController.get_one);


// it creates an user account
router.post("/", checkAuth, clientController.client_add);
// router.post("/", checkAuth, clientController.client_add);


// // it logs the user into the system
// router.post("/login", clientController.login);


// // it modifies user's data
// router.patch("/:userId", checkAuth, clientController.modify_user);

// // // change password
// // router.patch("password")


// it deletes a client account
router.delete("/:clientId", checkAuth, clientController.client_delete);


module.exports = router;