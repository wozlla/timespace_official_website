var express = require("express");
var router = express.Router();
var safe = require("../../bll/safe");
var DescriptionCategory = require("../../models/DescriptionCategory");

router.get("/", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();

    descriptionCategory.getList(function(error, list){
        res.render("admin/descriptionCategory/index", {
            descriptionCategory:list
        });
    });
});
router.get("/addPage", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();

    descriptionCategory.getList(function(err, list){
        res.render("admin/descriptionCategory/add", {
            categorys: list
        });
    });
});
router.get("/updatePage", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();

    descriptionCategory.get(req.param("id"), function(err, model){
        res.render("admin/descriptionCategory/update", {
            descriptionCategory: model
        });
    });
});

router.post("/", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();

    descriptionCategory.add({
        name: req.body.name
    },function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.redirect("/admin");
    });
});
router.put("/", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();
    descriptionCategory.update(req.param("id"), {
        name: req.param("name")
    },function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.send("/admin")
    });
});
router.delete("/", function(req, res, next) {
    var descriptionCategory = new DescriptionCategory();
    descriptionCategory.remove(req.param("id"),function (err) {
        if (err) {
            //todo error handle
            res.send("error");
            return;
        }
        res.send("/admin")
    });
});

module.exports = router;
