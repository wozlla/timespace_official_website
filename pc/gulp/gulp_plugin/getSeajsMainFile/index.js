var through = require('through-gulp'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs'),
mapOperator = require('../lib/resourceMapOperator');


var errorFunc = null;
var PLUGIN_NAME = "getSeajsMainFile";

//todo seajs.use path can be other path(not only the "/pc/js/xxx", but also like "js/xxx"(use base or align config)
function getFileContent() {
    var seajsOperator = mapOperator.seajs;

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
            var map = JSON.parse(fileContent);
            var seajsMainData = null;

            var i = null;
            var fileContent = null;
            var dist = null;



            for(i in map){
                if(map.hasOwnProperty(i)){
                    var data = seajsOperator.parse(map[i]);
                    var mainFilePath = data.mainFilePath;

                    fileContent = fs.readFileSync(mainFilePath, "utf8");


                    var newFile = new Vinyl({
                        base: path.dirname(mainFilePath),
                        path: mainFilePath,
                        contents: new Buffer(fileContent)
                    });

                    //custom attr for gulp-seajs-combo to set dist path
                    newFile.dist = data.dist;

                    this.push(newFile);
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
        callback();
    });

    return stream;
}

module.exports = getFileContent;

