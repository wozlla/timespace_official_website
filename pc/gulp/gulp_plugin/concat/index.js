var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
fileOperator = require('../lib/fileOperator');

var PLUGIN_NAME = "concat";

function concat() {
    var container = {};
    var DELIMITER = "\n\r";

    return through(function (file, encoding, callback) {
        if (file.isNull()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var filePath = file.dist;

            if(!container[filePath]){
                container[filePath] = fileOperator.createFile(new Buffer(fileContent), filePath);
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
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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
