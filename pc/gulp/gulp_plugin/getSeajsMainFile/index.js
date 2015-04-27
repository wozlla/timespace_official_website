var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs');

var errorFunc = null;
var PLUGIN_NAME = "rewriteStaticResourceUrl";

function getFileContent() {
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
            var map = JSON.parse(fileContent);
            var seajsMainData = null;

            var i = null;
            var fileContent = null;
            var dist = null;

            for(i in map){
                if(map.hasOwnProperty(i)){
                    seajsMainData = map[i].filter(function(data){
                        return data.command === "seajsMain";
                    })[0];

                    dist = seajsMainData.dist;
                    fileContent = fs.readFileSync(seajsMainData.fileUrlArr[0]);

                    file.contents = new Buffer(fileContent);

                    this.push(file);
                }
            }

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

module.exports = getFileContent;

