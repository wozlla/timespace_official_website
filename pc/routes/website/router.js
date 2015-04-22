var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var tryPlayRouter = require("./tryPlay");
var newsRouter = require("./news") ;
var descriptionRouter = require("./description");

router.use("/", indexRouter);
router.use("/tryPlay", tryPlayRouter);
router.use("/news", newsRouter);
router.use("/description", descriptionRouter);

module.exports = router;

