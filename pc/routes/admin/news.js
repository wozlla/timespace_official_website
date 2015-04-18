var express = require("express");
var router = express.Router();
var safe = require("../../bll/safe");
var News = require("../../models/News");

router.get("/addPage", function(req, res, next) {
    res.render("admin/news/add");
});
router.get("/updatePage", function(req, res, next) {
    var news = new News();

    news.get(req.param("id"), function(err, model){
        //model.body = safe.escapeHTML(model.body);

        res.render("admin/news/update", {
            news: model
        });
    });
});
//router.get("/deletePage", function(req, res, next) {
//    res.render("admin/news/delete");
//});

router.post("/", function(req, res, next) {
    var news = new News();
    news.add({
        title:req.body.title,
        //todo escape?
        body: req.body.body
    },function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/");//发表成功跳转到主页
        res.redirect("/admin");
    });
});
router.put("/", function(req, res, next) {
    var news = new News();
    news.update(req.param("id"), {
        title:req.param("title"),
        //todo escape?
        body: req.param("body")
    },function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/");//发表成功跳转到主页
        //res.redirect("/admin");
        res.send("/admin")
    });
});

module.exports = router;
