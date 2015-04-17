var express = require("express");
var router = express.Router();

router.get("/news", function(req, res, next) {
    res.render("news");
});
router.get("/description", function(req, res, next) {
    res.render("description");
});

module.exports = router;

