const express             = require("express");
const router              = express.Router();

const checkAuth           = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clockinController   = require("../controllers/clockin.js");


// rewrited endpoins for clockin
router.get("/clockins", checkAuth, clockinController.get_general);


// it returns all clockins
// router.get("/", clockinController.get_all);
router.get("/", checkAuth, clockinController.get_all);
// it is working - need to check if other process use it and whether is working or need adaptations


// it returns info about a particular clockin
router.get("/:clockinId", checkAuth, clockinController.get_one);


// it creates an user account
// router.post("/", clockinController.clockin_add);
router.post("/", checkAuth, clockinController.clockin_add);
// it is working but need to get pasclockins by GET and typeOfOperation query
// working good


// it deletes a particular clockin
router.delete("/", checkAuth, clockinController.clockin_delete);


module.exports = router;