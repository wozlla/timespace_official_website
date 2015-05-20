var express = require("express");
var router = express.Router();
var bulletinBoardRouter = require("./bulletinBoard");

router.use("/bulletinBoard", bulletinBoardRouter);

module.exports = router;

