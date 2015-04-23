var express = require("express");
var router = express.Router();
var DescriptionCategory = require("../../models/DescriptionCategory")

router.get("/", function(req, res, next) {
  var category = new DescriptionCategory();

  category.getList(function(error, list){
    res.render("website/index_try_play/indexTryPlay", {
      descriptionCategorys: list
    });
  });
});

module.exports = router;
