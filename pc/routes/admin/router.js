var express = require("express");
var router = express.Router();
var loginRouter = require("./login");
var indexRouter = require("./index");
var newsRouter = require("./news") ;
var descriptionRouter = require("./description") ;
var descriptionCategoryRouter = require("./descriptionCategory") ;
var isDev = require("../../setting").isDev;

if(!isDev){
    router.use("/", function(req, res, next){
        if(req.url === "/login" || req.session.user){
            next();
            return;
        }

        res.redirect("/pc/admin/login");
    });
}

router.use("/", indexRouter);
router.use("/login", loginRouter);
router.use("/news", newsRouter);
router.use("/description", descriptionRouter);
router.use("/descriptionCategory", descriptionCategoryRouter);

module.exports = router;
