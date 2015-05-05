var express = require("express");
var router = express.Router();
var ContactUs = require("../../models/ContactUs");

router.post("/", function(req, res, next) {
    var contact = new ContactUs();

    contact.add({
        name: req.body.name,
        email: req.body.email,
        body: req.body.body
    }, function (err) {
        if (err) {
            //todo error handle
            res.send(false);

            return;
        }

        res.send(true)
    });
});

module.exports = router;

