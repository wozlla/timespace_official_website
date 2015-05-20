var express = require("express");
var router = express.Router();
var BulletinBoard = require("../../models/game/BulletinBoard");


router.get("/detailPage74", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getFirst(function (error, model) {
        res.render("game/bulletinBoard/detail74", {
            model: model
        });
    });
});
router.get("/detailPage", function (req, res, next) {
    var bulletinBoard = new BulletinBoard();

    bulletinBoard.getFirst(function (error, model) {
        res.render("game/bulletinBoard/detail", {
            model: model
        });
    });
});


module.exports = router;

