var express = require("express");
var router = express.Router();
var User = require("../../models/User");

router.get("/", function(req, res, next) {
    res.render("admin/login", {
        error: req.flash("error")
    });
});
router.post("/", function(req, res, next) {
    var user = new User();

    if(!user.isCorrect(req.body.name, req.body.password)){
        req.flash("error", "name or pwd is error, please relogin");
        res.redirect("/pc/admin/login");
        return;
    }

    req.session.user = {
        name: req.body.name
    };
    req.flash("success", "login success");
    res.redirect("/pc/admin");
});

module.exports = router;
