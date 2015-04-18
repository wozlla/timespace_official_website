var express = require("express");
var router = express.Router();
var News = require("../../models/News");

router.get("/addPage", function(req, res, next) {
    res.render("admin/news/add");
});
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
        return res.redirect("/admin");
    });
});

module.exports = router;
