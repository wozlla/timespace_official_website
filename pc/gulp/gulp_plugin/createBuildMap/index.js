var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    buildConfigOperator = require("../lib/buildConfigOperator"),
    mapOperator = require("../lib/resourceMapOperator"),
    Parse = require("../lib/Parse");

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

            result[filePath] = new Parse.ParseCss(this, PLUGIN_NAME).parse(fileContent, buildConfig)
                .concat(new Parse.ParseJs(this, PLUGIN_NAME).parse(fileContent, buildConfig));

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

        //todo why it'll start rewrite task when not invoking callback here
        // (mean not finishing createBuildMap task!)

        //fs.writeFile(
        //    path.join(process.cwd(), "gulp/resourceMap.json"),
        //    JSON.stringify(result)
        //, function(e){
        //    if(e){
        //        gutil.log(e.message);
        //        self.emit("error", new gutil.PluginError(PLUGIN_NAME, e.message));
        //}
        //
        //        callback();
        //});
    });

    return stream;
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

