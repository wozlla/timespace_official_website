var express = require("express");
var path = require("path");
//var favicon = require("serve-favicon");
//var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var setting = require("./setting");
var flash = require('connect-flash');

var websiteRouter = require("./routes/website/router");
var adminRouter = require("./routes/admin/router");
var gameRouter = require("./routes/game/router");
//var admin = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
//app.use(logger("dev"));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(cookieParser());
app.use(session({ secret: setting.cookieSecret,
    key: setting.db,
    cookie: { maxAge: setting.maxAge},
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use("/pc", express.static(path.join(__dirname, "public")));
app.use("/pc/dist", express.static(path.join(__dirname, "dist")));

app.use("/pc", websiteRouter);
app.use("/pc/admin", adminRouter);
app.use("/pc/game", gameRouter);
//app.use("/admin", admin);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error("Not Found");
//  err.status = 404;
//  next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get("env") === "development") {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render("error", {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render("error", {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
