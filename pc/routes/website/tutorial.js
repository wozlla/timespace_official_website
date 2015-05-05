var express = require("express");
var router = express.Router();
var Tutorial = require("../../models/Tutorial");
var DescriptionCategory = require("../../models/DescriptionCategory")


router.get("/detailPage", function (req, res, next) {
    var category = new DescriptionCategory();
    var tutorial = new Tutorial();

    category.getList(function (error, categorys) {
        tutorial.getByName(decodeURIComponent(req.param("name")), function (error, model) {
            res.render("website/tutorial/list", {
                descriptionCategorys: categorys,
                model: model
            });
        });
    });
});


module.exports = router;

