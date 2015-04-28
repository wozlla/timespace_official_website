var express = require("express");
var router = express.Router();
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function(req, res, next) {
    var category = new DescriptionCategory();

    category.getList(function(error, categorys){
        res.render("website/download", {
            descriptionCategorys: categorys
        });
    });
});

module.exports = router;

