var express = require("express");
var router = express.Router();
var News = require("../../models/News");
var DescriptionCategory = require("../../models/DescriptionCategory")
var PAGESIZE = 1;

router.get("/", function(req, res, next) {
    var news = new News();
    var category = new DescriptionCategory();

    news.getList(1, PAGESIZE, function(error, list, pageData){
        category.getList(function(error, categorys){
            res.render("website/news", {
                news: list,
                pageData: pageData,
                descriptionCategorys: categorys
            });
        });
    });
});

router.get("/content", function(req, res, next) { var news = new News();
    //if(req.param("pageNumber")){
        news.getList(req.param("pageNumber"), PAGESIZE, function(error, list, pageData){
            res.render("website/newsContent", {
                news:list,
                pageData: pageData
            });
        });
    //}
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

