// routes/errorRoute.js
const express = require("express");
const router = express.Router();
const Util = require("../utilities");

// Intentional error route
router.get("/cause-error", Util.handleErrors(async (req, res) => {
  throw new Error("This is an intentional 500 error.");
}));

module.exports = router;