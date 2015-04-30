var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    mapOperator = require('../lib/resourceMapOperator'),
    fileOperator = require('../lib/fileOperator');

var PLUGIN_NAME = "getNoCmdJsFile";

function getFileContent() {
    var jsOperator = mapOperator.noCmdJs;

    return through(function (file, encoding, callback) {
        if (file.isNull()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var map = JSON.parse(fileContent);
            var self = this;


            var jsDataArr = jsOperator.getData(map);

            if(!jsDataArr){
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'no js data'));
                return callback();
            }

            jsDataArr.forEach(function(jsData){
                var data = jsOperator.parse(jsData);

                data.filePathArr.forEach(function(filePath){
                    fileContent = fs.readFileSync(filePath, "utf8");


                    var newFile = fileOperator.createFile(new Buffer(fileContent), filePath);


                    //custom attr for gulp-js-combo to set dist path
                    newFile.dist = data.dist;

                    self.push(newFile);

                });
            });

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    }, function (callback) {
        callback();
    });

    return stream;
}


module.exports = getFileContent;

