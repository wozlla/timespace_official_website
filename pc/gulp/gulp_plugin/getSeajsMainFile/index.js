var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    mapOperator = require('../lib/resourceMapOperator'),
    buildConfigOperator = require('../lib/buildConfigOperator'),
fileOperator = require('../lib/fileOperator');

var REGEX_MAINFILE_URL = /(seajs\.use\((['"]))(.+)(\2)/mg;
var PLUGIN_NAME = "getSeajsMainFile";

//todo seajs.use path can be other path(not only the "/pc/js/xxx", but also like "js/xxx"(use base or align config)
function getFileContent() {
    var seajsOperator = mapOperator.seajs;

    return through(function (file, encoding, callback) {
        var self = this;

        if (file.isNull()) {
            //errorFunc('Streaming not supported');
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var map = JSON.parse(fileContent);
            var fileContent = null;
            var buildConfig = buildConfigOperator.read();


            var seajsDataArr = seajsOperator.getData(map);

            if(!seajsDataArr){
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'no seajs data'));
                return callback();
            }

            seajsDataArr.forEach(function(data){
                var data = seajsOperator.parse(data);
                var mainFilePath = data.mainFilePath;

                fileContent = fs.readFileSync(mainFilePath, "utf8");

                fileContent = convertToAbsolutePath(fileContent, buildConfig);

                var newFile = fileOperator.createFile(new Buffer(fileContent), process.cwd(), mainFilePath);


                //custom attr for gulp-seajs-combo to set dist path
                newFile.dist = data.dist;

                self.push(newFile);
            });

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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

