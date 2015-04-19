var express = require("express");
var router = express.Router();
var News = require("../../models/News");
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function(req, res, next) {
    var news = new News();
    var category = new DescriptionCategory();

    news.getList(function(error, list){
        category.getList(function(error, categorys){
            res.render("website/news", {
                news: list,
                descriptionCategorys: categorys
            });
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

