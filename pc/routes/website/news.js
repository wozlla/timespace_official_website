var express = require("express");
var router = express.Router();
var News = require("../../models/News");
var DescriptionCategory = require("../../models/DescriptionCategory")
var safe = require("../../bll/safe");
var PAGESIZE = 10;


router.get("/", function(req, res, next) {
    var news = new News();
    var category = new DescriptionCategory();

    //jump to detail from index.ejs
    if(req.param("id")){
        category.getList(function(error, categorys){
            news.get(req.param("id"), function(error, model){
                res.render("website/news", {
                    descriptionCategorys: categorys,
                    model: model
                });
            });
        });

        return;
    }


    news.getListByCondition(1, PAGESIZE, {
        isShow:true
    },function(error, list, pageData){
        //todo optimize!remove in front end
        _handleBody(list);

        category.getList(function(error, categorys){
            res.render("website/news", {
                news: list,
                pageData: pageData,
                //if not set model attri, ejs will throw error in "<% if(model){ %>" code:model is not defined
                model:null,

                descriptionCategorys: categorys
            });
        });
    });
});

router.get("/content", function(req, res, next) { var news = new News();
    news.getListByCondition(req.param("pageNumber"), PAGESIZE, {
        isShow: true
    }, function(error, list, pageData){
        _handleBody(list);

        res.render("website/newsContent", {
            news:list,
            pageData: pageData
        });
    });
});
router.get("/detailPage", function(req, res, next) {
    var news = new News();

    news.get(req.param("id"), function(error, model){
        res.render("website/newsDetail", {
            model: model
        });
    });
});

function _handleBody(list){
    var MAXLENGTH = 80;

    list.forEach(function(model){
        model.body = safe.removeHtmlLabel(model.body);

        if(model.body.length >= MAXLENGTH){
            model.body = model.body.slice(0, MAXLENGTH) + "......";
        }
    })
}

module.exports = router;

