var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    buildConfigOperator = require("../lib/buildConfigOperator"),
    mapOperator = require("../lib/resourceMapOperator"),
    parse = require("../lib/parse");

var PLUGIN_NAME = "createBuildMap";


//todo filter annotated script
function createBuildMap() {
    var result = {};

    return through(function(file, encoding,callback) {
        var fileContent = null,
            filePath = null,
            buildConfig = null;

        if (file.isNull()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            fileContent = file.contents.toString();
            filePath = file.path;
            buildConfig = buildConfigOperator.read();

            result[filePath] = new parse.ParseCss(this, PLUGIN_NAME).parse(fileContent, buildConfig)
                .concat(new parse.ParseJs(this, PLUGIN_NAME).parse(fileContent, buildConfig));

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    },function(callback) {
        mapOperator.write(JSON.stringify(result));

        callback();
    });
}



function _getFileUrlArr(content, buildConfig, regex_url){
    var dataArr = null,
        result = [];

    while((dataArr = regex_url.exec(content)) !== null) {
        result.push(buildConfigOperator.convertToPathRelativeToCwd(dataArr[2], buildConfig));
    }

    return result;
}

module.exports = createBuildMap;

