var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var newsRouter = require("./news") ;
var descriptionRouter = require("./description");

router.use("/", indexRouter);
router.use("/news", newsRouter);
router.use("/description", descriptionRouter);

module.exports = router;

