var express = require("express");
var router = express.Router();
var Description = require("../../models/Description");
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function (req, res, next) {
    var description = new Description();
    var category = new DescriptionCategory();

    //jump to detail from index.ejs
    if (req.param("id")) {
        category.getList(function (error, categorys) {
            description.get(req.param("id"), function (error, model) {
                res.render("website/description/description", {
                    descriptionCategorys: categorys,
                    model: model
                });
            });
        });

        return;
    }
    else if (req.param("category")) {
        category.getList(function (error, categorys) {
            description.getListByCategory(req.param("category"), function (error, list) {
                res.render("website/description/description", {
                    descriptionCategorys: categorys,
                    //if not set model attri, ejs will throw error in "<% if(model){ %>" code:model is not defined
                    model:null,
                    descriptionsByCategory:list,
                    category: req.param("category")
                });
            });
        });

        return;
    }

    description.getListByCondition({
        isShow:true
    },function (error, list) {
        category.getList(function (error, categorys) {
            res.render("website/description/description", {
                descriptions: list,

                //if not set model attri, ejs will throw error in "<% if(model){ %>" code:model is not defined
                model: null,
                descriptionsByCategory:null,

                descriptionCategorys: categorys
            });
        });
    });
});
router.get("/detailPage", function (req, res, next) {
    var description = new Description();

    description.get(req.param("id"), function (error, model) {
        res.render("website/description/descriptionDetail", {
            model: model
        });
    });
});

module.exports = router;

