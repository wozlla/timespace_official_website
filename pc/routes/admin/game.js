var express = require("express");
var path = require("path");
var router = express.Router();
var safe = require("../../bll/safe");
var convert = require("../../bll/convert");
var BulletinBoard = require("../../models/game/BulletinBoard");
var PAGESIZE = 10;

//todo now /game is point to /game/bulletinBoard, should add /game("/") content
router.get("/", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getList(1, PAGESIZE, function (error, list, pageData) {
        res.render("admin/game/bulletinBoard/index", {
            bulletinBoard: list,
            pageData: pageData
        });
    });
});

router.get("/bulletinBoard", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getList(1, PAGESIZE, function (error, list, pageData) {
        res.render("admin/game/bulletinBoard/index", {
            bulletinBoard: list,
            pageData: pageData
        });
    });
});
router.get("/bulletinBoard/content", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getList(req.param("pageNumber"), PAGESIZE, function (error, list, pageData) {
        res.render("admin/game/bulletinBoard/content", {
            bulletinBoard: list,
            pageData: pageData
        });
    });
});

router.get("/bulletinBoard/addPage", function (req, res, next) {
    res.render("admin/game/bulletinBoard/add");
});
router.get("/bulletinBoard/updatePage", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getFirst(function (err, model) {
        res.render("admin/game/bulletinBoard/update", {
            bulletinBoard: model
        });
    });
});

router.post("/bulletinBoard", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();


    bulletinBoard.check(null, req.body.title, function (errMessage) {
        if(errMessage){
            res.send({
                isSuccess: false,
                message: "只能有一个公告"
            });
            return;
        }

        bulletinBoard.add({
            title: req.body.title,
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
            //res.redirect("/bulletinBoardpc/admin");
            //res.send("/bulletinBoardpc/admin")
            res.send({
                isSuccess: true,
                url: "/pc/admin/"
            });
        });
    });
});
router.put("/bulletinBoard", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.update(req.param("id"), {
        title: req.param("title"),
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
        //res.redirect("/bulletinBoard");//发表成功跳转到主页
        //res.redirect("/bulletinBoardpc/admin");
        res.send({
            isSuccess: true,
            url: "/pc/admin/"
        });
    });
});
router.delete("/bulletinBoard", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();
    bulletinBoard.remove(req.param("id"), function (err) {
        if (err) {
            //req.flash("error", err);

            //todo error handle
            res.send("error");
            return;
        }
        //req.flash("success", "发布成功!");
        //res.redirect("/bulletinBoard");//发表成功跳转到主页
        //res.redirect("/bulletinBoardpc/admin");
        res.send("/pc/admin");
        //res.send("success");
    });
});

module.exports = router;

