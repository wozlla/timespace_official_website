var express = require("express");
var path = require("path");
var router = express.Router();
var safe = require("../../bll/safe");
var News = require("../../models/News");
var file = require("../lib/file");
var yTool = require("../../public/js/bower_components/yyctoolbox/tool/yTool");
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
        res.render("admin/news/newsContent", {
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
    //var iconBase64Data = yTool.code.base64.decode(req.param("icon")),
    var iconBase64Data = req.param("icon"),
        ext = req.param("ext"),
        uploadFilePath = path.resolve(__dirname + "/../../public/upload/newsIcon/"),
    //todo md5?
        fileName = "icon_" + +new Date() + ext,
        writePath = path.join(uploadFilePath, fileName),
        urlForFrontEnd = path.join("/pc/upload/newsIcon/", fileName);


    //过滤data:URL
    var base64Data = iconBase64Data.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');


    file.writeFile(writePath, dataBuffer, function (err, data) {
        if (err) {
            res.send({
                isSuccess: false,
                message: err.message
            });
            return;
        }

        res.send({
            url: urlForFrontEnd,
            isSuccess: true
        });
    });
});


router.post("/", function (req, res, next) {
    var news = new News();
    news.add({
        title: req.body.title,
        icon: req.body.icon,
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
        //res.redirect("/");//发表成功跳转到主页
        res.send("/pc/admin")
    });
});
router.put("/", function (req, res, next) {
    var news = new News();
    news.update(req.param("id"), {
        title: req.param("title"),
        icon: req.param("icon"),
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
