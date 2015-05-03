var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var indexTryPlayRouter = require("./indexTryPlay");
var tryPlayRouter = require("./tryPlay");
var newsRouter = require("./news") ;
var descriptionRouter = require("./description");
var downloadRouter = require("./download") ;
var contactUsRouter = require("./contactUs") ;

router.use("/", indexRouter);
router.use("/index", indexRouter);
router.use("/indexTryPlay", indexTryPlayRouter);
//router.use("/play", indexTryPlayRouter);
//router.use("/play.html", indexTryPlayRouter);
router.use("/play", indexRouter);
router.use("/play.html", indexRouter);
router.use("/tryPlay", tryPlayRouter);
router.use("/news", newsRouter);
router.use("/description", descriptionRouter);
router.use("/download", downloadRouter);
router.use("/contactUs", contactUsRouter);

module.exports = router;

