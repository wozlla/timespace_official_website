var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    mapOperator = require("../lib/resourceMapOperator"),
    buildConfigOperator = require("../lib/buildConfigOperator"),
    fileOperator = require("../lib/fileOperator");

var REGEX_MAINFILE_URL = /(seajs\.use\((['"]))(.+)(\2)/mg,
    PLUGIN_NAME = "getSeajsMainFile";

//todo seajs.use path can be other path(not only the "/pc/js/xxx", but also like "js/xxx"(use base or align config)
function getFileContent() {
    var seajsOperator = mapOperator.seajs;

    return through(function (file, encoding, callback) {
        var self = this,
            buildConfig = null,
            seajsDataArr = null;

        if (file.isNull()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            buildConfig = buildConfigOperator.read();
            seajsDataArr = seajsOperator.getData(JSON.parse(file.contents.toString()));

            if (!seajsDataArr) {
                this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'no seajs data'));
                return callback();
            }

            seajsDataArr.forEach(function (data) {
                var data = seajsOperator.parse(data),
                    mainFilePath = data.mainFilePath,
                    newFile = null;

                fileContent = convertToAbsolutePath(
                    fs.readFileSync(mainFilePath, "utf8"),
                    buildConfig
                );

                newFile = fileOperator.createFile(new Buffer(fileContent), process.cwd(), mainFilePath);
                //custom attr for gulp-seajs-combo to set dist path
                newFile.dist = data.dist;

                self.push(newFile);
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
}


function convertToAbsolutePath(fileContent, buildConfig) {
    return fileContent.replace(REGEX_MAINFILE_URL, function (fullMatch, p1, p2, p3, p4) {
        return p1 + path.resolve(process.cwd(), buildConfigOperator.convertToPathRelativeToCwd(p3, buildConfig)) + p4;
    });
}

module.exports = getFileContent;

