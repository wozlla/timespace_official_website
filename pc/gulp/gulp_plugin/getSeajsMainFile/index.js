var through = require('through-gulp'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs'),
    mapOperator = require('../lib/resourceMapOperator'),
    buildConfigOperator = require('../lib/buildConfigOperator');

var REGEX_MAINFILE_URL = /(seajs\.use\((['"]))(.+)(\2)/mg;
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
            var fileContent = null;
            var self = this;
            var buildConfig = buildConfigOperator.read();


            var seajsDataArr = seajsOperator.getData(map);

            if(!seajsDataArr){
                errorFunc('no seajs data');
                return callback();
            }

            seajsDataArr.forEach(function(data){
                var data = seajsOperator.parse(data);
                var mainFilePath = data.mainFilePath;

                fileContent = fs.readFileSync(mainFilePath, "utf8");

                fileContent = convertToAbsolutePath(fileContent, buildConfig);

                var newFile = new Vinyl({
                    base: path.dirname(mainFilePath),
                    path: mainFilePath,
                    contents: new Buffer(fileContent)
                });


                //custom attr for gulp-seajs-combo to set dist path
                newFile.dist = data.dist;

                self.push(newFile);
            });

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


function convertToAbsolutePath(fileContent, buildConfig){
    return fileContent.replace(REGEX_MAINFILE_URL, function(fullMatch, p1, p2, p3, p4){
        return p1 + path.resolve(process.cwd(), buildConfigOperator.convertToPathRelativeToCwd(p3, buildConfig)) + p4;
    });
}

module.exports = getFileContent;

