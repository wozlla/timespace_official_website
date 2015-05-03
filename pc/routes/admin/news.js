var express = require("express");
var path = require("path");
var router = express.Router();
var safe = require("../../bll/safe");
var convert = require("../../bll/convert");
var News = require("../../models/News");
var fileUploader = require("../../public/js/bower_components/yyctoolbox/fileOperator/upload/server/main");
var PAGESIZE = 10;

router.get("/", function (req, res, next) {
    var news = new News();
    var news = new News();

    news.getList(1, PAGESIZE, function (error, list, pageData) {
        res.render("admin/news/index", {
            news: list,
            pageData: pageData
        });
    });
});
router.get("/content", function (req, res, next) {
    var news = new News();
    news.getList(req.param("pageNumber"), PAGESIZE, function (error, list, pageData) {
        res.render("admin/news/content", {
            news: list,
            pageData: pageData
        });
    });
});
router.get("/addPage", function (req, res, next) {
    res.render("admin/news/add");
});
router.get("/updatePage", function (req, res, next) {
    var news = new News();

    news.get(req.param("id"), function (err, model) {
        //model.body = safe.escapeHTML(model.body);

        res.render("admin/news/update", {
            news: model
        });
    });
});
//router.get("/deletePage", function(req, res, next) {
//    res.render("admin/news/delete");
//});


//todo manage img:replace existed img
router.post("/uploadIcon", function (req, res, next) {
    var iconBase64Data = req.param("base64Data"),
        fileName = req.param("fileName"),
        clientDirname = "/pc/upload/newsIcon/",
        uploadFilePath = path.resolve(__dirname + "/../../public/upload/newsIcon/");

    fileUploader.saveUploadImage(uploadFilePath, clientDirname, iconBase64Data, fileName, function (err, clientPath) {
        if (err) {
            res.send({
                isSuccess: false,
                message: err.message
            });
            return;
        }

        res.send({
            url: clientPath,
            isSuccess: true
        });
    });
});


router.post("/", function (req, res, next) {
    var news = new News();
    news.add({
        title: req.body.title,
        icon: req.body.icon,
        isShow: convert.toBool(req.body.isShow),
        //todo escape?
        body: req.body.body
    }, function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/pc/admin");
        res.send("/pc/admin")
    });
});
router.put("/", function (req, res, next) {
    var news = new News();
    news.update(req.param("id"), {
        title: req.param("title"),
        icon: req.param("icon"),
        isShow: convert.toBool(req.param("isShow")),
        //todo escape?
        body: req.param("body")
    }, function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/");//发表成功跳转到主页
        //res.redirect("/pc/admin");
        res.send("/pc/admin")
    });
});
router.delete("/", function (req, res, next) {
    var news = new News();
    news.remove(req.param("id"), function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/");//发表成功跳转到主页
        //res.redirect("/pc/admin");
        res.send("/pc/admin")
        //res.send("success");
    });
});

module.exports = router;
