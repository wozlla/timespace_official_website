var express = require("express");
var router = express.Router();
//var newsRouter = require("./news");
//var descriptionRouter = require("./description");
//var descriptionCategoryRouter = require("./descriptionCategory");
//var uploadRouter = require("./upload");
//var contactUsRouter = require("./contactUs");
//var tutorialRouter = require("./tutorial");
//var gameRouter = require("./game");
//var descriptionRouter = require("./description");
//var User = require("../../models/User");


router.get("/", function(req, res, next) {
    res.render("admin/index");
});

//router.use("/news", newsRouter);
//router.use("/description", descriptionRouter);
//router.use("/descriptionCategory", descriptionCategoryRouter);
//router.use("/upload", uploadRouter);
//router.use("/contactUs", contactUsRouter);
//router.use("/tutorial", tutorialRouter);
//router.use("/game", gameRouter);

//router.get("/descriptionCategory", function(req, res, next) {
//    res.render("admin/descriptionCategory/index");
//});


module.exports = router;
