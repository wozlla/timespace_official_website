var express = require("express");
var path = require("path");
var router = express.Router();
var safe = require("../../bll/safe");
var convert = require("../../bll/convert");
var Tutorial = require("../../models/Tutorial");
var PAGESIZE = 10;

router.get("/", function (req, res, next) {
    var tutorial = new Tutorial();

    tutorial.getList(1, PAGESIZE, function (error, list, pageData) {
        res.render("admin/tutorial/index", {
            tutorial: list,
            pageData: pageData
        });
    });
});
router.get("/content", function (req, res, next) {
    var tutorial = new Tutorial();
    tutorial.getList(req.param("pageNumber"), PAGESIZE, function (error, list, pageData) {
        res.render("admin/tutorial/content", {
            tutorial: list,
            pageData: pageData
        });
    });
});
router.get("/addPage", function (req, res, next) {
    res.render("admin/tutorial/add");
});
router.get("/updatePage", function (req, res, next) {
    var tutorial = new Tutorial();

    var categorys = [
        {
            name: "入门"
        },
        {
            name: "进阶"
        },
        {
            name: "装备"
        },
        {
            name: "组合"
        },
        {
            name: "玩看点"
        },
        {
            name: "特看点"
        },
        {
            name: "技看点"
        }
    ];

    tutorial.get(req.param("id"), function (err, model) {
        //model.body = safe.escapeHTML(model.body);

        res.render("admin/tutorial/update", {
            categorys: categorys,
            tutorial: model
        });
    });
});
//router.get("/deletePage", function(req, res, next) {
//    res.render("admin/tutorial/delete");
//});


router.post("/", function (req, res, next) {
    var tutorial = new Tutorial();


    tutorial.check(null, req.body.name, function (errMessage) {
        if (errMessage) {
            //todo error handle
            //todo unitify send format
            res.send({
                isSuccess: false,
                message: errMessage
            });
            return;
        }

        tutorial.add({
            //title: req.body.title,
            name: req.body.name,
            //todo escape?
            body: req.body.body
        }, function (err) {
            if (err) {
                //req.flash("error", err);

                //todo error handle
                res.send({
                    isSuccess: false,
                    message: err.message
                });
                return;
            }
            //req.flash("success", "发布成功!");
            //res.redirect("/pc/admin");
            //res.send("/pc/admin")
            res.send({
                isSuccess: true,
                url: "/pc/admin"
            });
        });
    })

});
router.put("/", function (req, res, next) {
    var tutorial = new Tutorial();

    tutorial.check(req.param("id"),req.param("name"), function (errMessage) {
        if (errMessage) {
            //todo error handle
            res.send({
                isSuccess: false,
                message: errMessage
            });
            return;
        }
        tutorial.update(req.param("id"), {
            //title: req.param("title"),
            name: req.param("name"),
            //todo escape?
            body: req.param("body")
        }, function (err) {
            if (err) {
                //req.flash("error", err);

                //todo error handle
                res.send({
                    isSuccess: false,
                    message: err.message
                });
                return;
            }
            //req.flash("success", "发布成功!");
            //res.redirect("/");//发表成功跳转到主页
            //res.redirect("/pc/admin");
            res.send({
                isSuccess: true,
                url: "/pc/admin"
            });
        });
    });
});
router.delete("/", function (req, res, next) {
    var tutorial = new Tutorial();
    tutorial.remove(req.param("id"), function (err) {
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
