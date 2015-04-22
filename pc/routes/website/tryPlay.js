var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    //var category = new DescriptionCategory();
    //
    //category.getList(function(error, list){
    //    res.render("website/index", {
    //        descriptionCategorys: list
    //    });
    //});
    res.render("website/tryPlay");
});

module.exports = router;

