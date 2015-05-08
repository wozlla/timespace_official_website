var express = require("express");
var router = express.Router();
var path = require("path");
var formidable = require("formidable");
var fileUploader = require("../../public/js/bower_components/yyctoolbox/fileOperator/upload/server/main");

router.post("/", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + "/../../public/upload";

    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }

        //todo refactor:no hard code here!(imgFile)
        var image = files.imgFile;

        var path = image.path;
        path = path.replace("/\\/g", "/");
        var url = "/pc/upload" + path.substr(path.lastIndexOf("/"), path.length);

        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });
});

//this is application/x-www-form-urlencoded type
//todo manage img:replace existed img
router.post("/uploadIcon", function (req, res, next) {
    var iconBase64Data = req.param("base64Data"),
        fileName = req.param("fileName"),
        clientDirname = "/pc/upload/newsIcon/",
        uploadFilePath = path.resolve(__dirname + "/../../public/upload/newsIcon/");

    fileUploader.saveUploadImage(uploadFilePath, clientDirname, iconBase64Data, fileName, function (err, clientPath) {
        if (err) {
            res.send({
                isSuccess: false,
                message: err.message
            });
            return;
        }

        res.send({
            url: clientPath,
            isSuccess: true
        });
    });
});

module.exports = router;

