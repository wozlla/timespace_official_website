var express = require("express");
var router = express.Router();
var Description = require("../../models/Description");
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function(req, res, next) {
    var description = new Description();
    var category = new DescriptionCategory();

    description.getList(function(error, list){
        category.getList(function(error, categorys){
            res.render("website/description", {
                descriptions: list,
                descriptionCategorys: categorys
            });
        });
    });
});
router.get("/detailPage", function(req, res, next) {
    var description = new Description();

    description.get(req.param("id"), function(error, model){
        res.render("website/descriptionDetail", {
            description: model
        });
    });
});

module.exports = router;

