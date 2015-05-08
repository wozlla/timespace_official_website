var express = require("express");
var router = express.Router();
var newsRouter = require("./news");
var descriptionRouter = require("./description");
var descriptionCategoryRouter = require("./descriptionCategory");
//var descriptionRouter = require("./description");
var formidable = require("formidable");
//var User = require("../../models/User");


router.get("/", function(req, res, next) {
    res.render("admin/index");
});

router.use("/news", newsRouter);
router.use("/description", descriptionRouter);
router.use("/descriptionCategory", descriptionCategoryRouter);

//router.get("/descriptionCategory", function(req, res, next) {
//    res.render("admin/descriptionCategory/index");
//});

//    var dom = $(this.edit.doc.getElementsByClassName(this.bodyClass));
router.post("/upload", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + "/../../public/upload";

    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }

        var image = files.imgFile;
        var path = image.path;
        path = path.replace("/\\/g", "/");
        var url = "/pc/upload" + path.substr(path.lastIndexOf("/"), path.length);

        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });
});

module.exports = router;
