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

        var info = {
            "error": 0,
            //todo refactor:no hard code here!(imgFile)
            "url": getUrl(files.imgFile)
        };
        res.send(info);
    });
});
router.post("/batch", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + "/../../public/upload";

    form.parse(req, function (err, fields, files) {
        var index = 0,
            urlArr = [];

        if (err) {
            throw err;
        }

        while(files["imgFile" + String(index)]){
            urlArr.push([index, getUrl(files["imgFile" + String(index)])]);

            index = index + 1;
        }

        var info = {
            "error": 0,
            "urlArr": urlArr
        };

        res.send(info);
    });
});


function getUrl(image){
    var path = image.path;
    path = path.replace("/\\/g", "/");

    return "/pc/upload" + path.substr(path.lastIndexOf("/"), path.length);
}

//this is application/x-www-form-urlencoded type
//todo manage img:replace existed img
router.post("/icon", function (req, res, next) {
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

