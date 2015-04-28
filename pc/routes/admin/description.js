var express = require("express");
var router = express.Router();
var safe = require("../../bll/safe");
var Description = require("../../models/Description");
var Category = require("../../models/DescriptionCategory");

router.get("/", function(req, res, next) {
    var description = new Description();

    description.getList(function(error, list){
        res.render("admin/description/index", {
            descriptions:list
        });
    });
});
router.get("/addPage", function(req, res, next) {
   var category = new Category();

    category.getList(function(err, list){
        res.render("admin/description/add", {
            categorys: list
        });
    });
});
router.get("/updatePage", function(req, res, next) {
    var description = new Description();

    description.get(req.param("id"), function(err, model){
        var category = new Category();

        category.getList(function(err, list){
            res.render("admin/description/update", {
                categorys: list,
                description: model
            });
        });
    });
});

router.post("/", function(req, res, next) {
    var description = new Description();
    description.add({
        category: req.body.category,
        title:req.body.title,
        //todo escape?
        body: req.body.body
    },function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.redirect("/pc/admin");
    });
});
router.put("/", function(req, res, next) {
    var description = new Description();
    description.update(req.param("id"), {
        category: req.param("category"),
        title:req.param("title"),
        //todo escape?
        body: req.param("body")
    },function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.send("/pc/admin")
    });
});
router.delete("/", function(req, res, next) {
    var description = new Description();
    description.remove(req.param("id"),function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.send("/pc/admin")
    });
});

module.exports = router;
