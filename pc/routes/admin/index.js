var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var User = require("../../models/User");
var News = require("../../models/News");

router.get("/", function(req, res, next) {
    var news = new News();

    news.getList(function(error, list){
        var news = new News();

        res.render("admin/index", {
            news: list
        });
    });
});
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
        var url = "/upload" + path.substr(path.lastIndexOf("/"), path.length);

        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });
});

module.exports = router;
