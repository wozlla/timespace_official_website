var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    mapOperator = require("../lib/resourceMapOperator"),
    buildConfigOperator = require("../lib/buildConfigOperator");

var PLUGIN_NAME = "rewriteStaticResourceUrl";

function rewrite() {
    return through(function (file, encoding, callback) {
        var map = null;

        if (file.isNull()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            map = mapOperator.read();

            file.contents = new Buffer(handleContent(
                file.contents.toString(), map[file.path]
            ));

            this.push(file);
            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    });

    return stream;
}

function handleContent(content, mapDataArr) {
    var result = "",
        startIndex = 0,
        buildConfig = buildConfigOperator.read();

    mapDataArr.forEach(function (mapData) {
        switch (mapData.command) {
            case "replace":
            case "seajsMain":
                result = result + content.slice(startIndex, mapData.startLine)
                    + "<script src='" + buildConfigOperator.convertToAbsolutePath(mapData.dist, buildConfig) + "'></script>";
                break;
            default:
                break;
        }

        startIndex = mapData.endLine;
    });

    return result;
}

module.exports = rewrite;
