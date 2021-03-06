var express = require("express");
var router = express.Router();
var ContactUs = require("../../models/ContactUs");
var PAGESIZE = 10;

router.get("/", function (req, res, next) {
    var contactUs = new ContactUs();

    contactUs.getList(1, PAGESIZE, function (error, list, pageData) {
        res.render("admin/contactUs/index", {
            contactUs: list,
            pageData: pageData
        });
    });
});
router.get("/content", function (req, res, next) {
    var contactUs = new ContactUs();
    contactUs.getList(req.param("pageNumber"), PAGESIZE, function (error, list, pageData) {
        res.render("admin/contactUs/Content", {
            contactUs: list,
            pageData: pageData
        });
    });
});

router.delete("/", function (req, res, next) {
    var contactUs = new ContactUs();
    contactUs.remove(req.param("id"), function (err) {
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

