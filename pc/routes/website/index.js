var express = require("express");
var router = express.Router();
var DescriptionCategory = require("../../models/DescriptionCategory")
var News = require("../../models/News");
var safe = require("../../bll/safe");
var PAGESIZE = 10;

router.get("/", function(req, res, next) {
  var category = new DescriptionCategory();
  var news = new News();

  news.getList(1, PAGESIZE, function(error, newsList){
    category.getList(function(error, list){
      res.render("website/index", {
        descriptionCategorys: list,
        newsList: newsList,
        safe: safe
      });
    });
  });
});

module.exports = router;
