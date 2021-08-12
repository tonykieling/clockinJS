const express           = require("express");
const router            = express.Router();

const checkAuth         = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clientController  = require("../controllers/client.js");


// it returns all users
router.get("/", checkAuth, clientController.get_all);
// it is working


// it returns info about a particular client
router.get("/:clientId", checkAuth, clientController.get_one);
// not sure whether this method is being used


// it creates an user account
router.post("/", checkAuth, clientController.client_add);
// it is working


// it modifies user's data
router.patch("/:clientId", checkAuth, clientController.client_modify);
// it is working fine


// it deletes a client account
// not being considered right now.
// instead of deleting, there is the option to inactived a particular client
router.delete("/:clientId", checkAuth, clientController.client_delete);


module.exports = router;