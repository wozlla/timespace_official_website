var through = require('through-gulp'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs');

var errorFunc = null;
var PLUGIN_NAME = "concat";

function concat() {
    var container = {};
    var DELIMITER = "\n\r";

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
            var filePath = file.dist;

            if(!container[filePath]){
                container[filePath] = new Vinyl({
                    base: process.cwd(),
                    path: path.resolve(process.cwd(), filePath),
                    contents: new Buffer(fileContent)
                });
            }
            else{
                container[filePath].contents = new Buffer(
                    container[filePath].contents.toString()
                    + DELIMITER + fileContent
                );
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
        var i = null;

        for(i in container){
            if(container.hasOwnProperty(i)){
               this.push(container[i]);
            }
        }

        callback();
    });

    return stream;
}


module.exports = concat;
