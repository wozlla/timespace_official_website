var express = require("express");
var router = express.Router();
var News = require("../../models/News");

router.get("/", function(req, res, next) {
    var news = new News();

    news.getList(function(error, list){
        res.render("website/news", {
            news: list
        });
    });
});
router.get("/detailPage", function(req, res, next) {
    var news = new News();

    news.get(req.param("id"), function(error, model){
        res.render("website/newsDetail", {
            news: model
        });
    });
});

module.exports = router;

