var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    mapOperator = require("../lib/resourceMapOperator"),
    fileOperator = require("../lib/fileOperator");

var PLUGIN_NAME = "getNoCmdJsFile";

function getFileContent() {
    var jsOperator = mapOperator.noCmdJs;

    return through(function (file, encoding, callback) {
        var self = this,
            jsDataArr = null;

        if (file.isNull()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            jsDataArr = jsOperator.getData(JSON.parse(file.contents.toString()));

            if(!jsDataArr){
                this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'no js data'));
                return callback();
            }

            jsDataArr.forEach(function(jsData){
                var data = jsOperator.parse(jsData);

                data.filePathArr.forEach(function(filePath){
                    var newFile = null,
                        fileContent = null;

                    fileContent = fs.readFileSync(filePath, "utf8");
                    newFile = fileOperator.createFile(new Buffer(fileContent), filePath);
                    //custom attr for gulp-js-combo to set dist path
                    newFile.dist = data.dist;

                    self.push(newFile);
                });
            });

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    }, function (callback) {
        callback();
    });

    return stream;
}


module.exports = getFileContent;

