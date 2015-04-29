var express = require("express");
var router = express.Router();
var Description = require("../../models/Description");
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function(req, res, next) {
    var description = new Description();
    var category = new DescriptionCategory();

    //jump to detail from index.ejs
    if(req.param("id")){
        category.getList(function(error, categorys){
            description.get(req.param("id"), function(error, model){
                res.render("website/description", {
                    descriptionCategorys: categorys,
                    model: model
                });
            });
        });

        return;
    }

    description.getList(function(error, list){
        category.getList(function(error, categorys){
            res.render("website/description", {
                descriptions: list,
                //if not set model attri, ejs will throw error in "<% if(model){ %>" code:model is not defined
                model:null,
                descriptionCategorys: categorys
            });
        });
    });
});
router.get("/detailPage", function(req, res, next) {
    var description = new Description();

    description.get(req.param("id"), function(error, model){
        res.render("website/descriptionDetail", {
            model: model
        });
    });
});

module.exports = router;

