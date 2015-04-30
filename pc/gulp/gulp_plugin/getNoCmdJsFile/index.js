var through = require('through-gulp'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs'),
    mapOperator = require('../lib/resourceMapOperator'),
    buildConfigOperator = require('../lib/buildConfigOperator');

var errorFunc = null;
var PLUGIN_NAME = "getSeajsMainFile";

//todo js.use path can be other path(not only the "/pc/js/xxx", but also like "js/xxx"(use base or align config)
function getFileContent() {
    var jsOperator = mapOperator.noCmdJs;

    return through(function (file, encoding, callback) {
        var self = this;

        errorFunc = function (msg) {
            gutil.log(msg);
            self.emit('error', new gutil.PluginError(PLUGIN_NAME, msg));
        };

        // do whatever necessary to process the file
        if (file.isNull()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var map = JSON.parse(fileContent);
            var fileContent = null;
            var self = this;


            var jsDataArr = jsOperator.getData(map);

            if(!jsDataArr){
                errorFunc('no js data');
                return callback();
            }

            jsDataArr.forEach(function(jsData){
                var data = jsOperator.parse(jsData);

                data.filePathArr.forEach(function(filePath){
                    fileContent = fs.readFileSync(filePath, "utf8");

                    //fileContent = convertToAbsolutePath(fileContent, buildConfig);

                    var newFile = new Vinyl({
                        base: path.dirname(filePath),
                        path: filePath,
                        contents: new Buffer(fileContent)
                    });


                    //custom attr for gulp-js-combo to set dist path
                    newFile.dist = data.dist;

                    self.push(newFile);

                });

                //
                //var mainFilePath = data.mainFilePath;
                //
                //fileContent = fs.readFileSync(mainFilePath, "utf8");
                //
                //fileContent = convertToAbsolutePath(fileContent, buildConfig);
                //
                //var newFile = new Vinyl({
                //    base: path.dirname(mainFilePath),
                //    path: mainFilePath,
                //    contents: new Buffer(fileContent)
                //});
                //
                //
                ////custom attr for gulp-js-combo to set dist path
                //newFile.dist = data.dist;
                //
                //self.push(newFile);
            });

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    }, function (callback) {
        callback();
    });

    return stream;
}


module.exports = getFileContent;

