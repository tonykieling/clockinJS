const express         = require("express");
const router          = express.Router();

const checkAuth       = require("../middleware/check-auth.js")  // it calls the middleware which checks if user's authorized
const clockinReport   = require("../reports/clockin.js");
// const invoiceReport   = require("");

// clockin's report for a specif client of a user
router.get("/clockins", checkAuth, clockinReport.general);

// // invoice's report
// router.get("/invoices", checkAuth, clockinController.get_general);

module.exports = router;
