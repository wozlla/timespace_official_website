var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs');


var errorFunc = null;
var PLUGIN_NAME = "rewriteStaticResourceUrl";

function rewrite() {
    // creating a stream through which each file will pass
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
            var filePath = file.path;
            var map = JSON.parse(fs.readFileSync(path.join(process.cwd(), "gulp/resourceMap.json"), "utf8"));

            file.contents = new Buffer(handleContent(fileContent, map[filePath]));

            this.push(file);
            callback();
        }
        //todo support stream
        if (file.isStream()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    }, function (callback) {
        // just pipe data next, just callback to indicate that the stream's over
        //this.push(something);
        callback();
    });

    // returning the file stream
    return stream;
}

function handleContent(content, mapDataArr) {
    var result = "",
        startIndex = 0;

    mapDataArr.forEach(function (mapData) {
        switch (mapData.command) {
            case "replace":
            case "seajsMain":
                result = result + content.slice(startIndex, mapData.startLine)
                    + "<script src='" + mapData.dist + "'></script>";
                break;
            default:
                break;
        }

        startIndex = mapData.endLine;
    });

    return result;
}

module.exports = rewrite;
