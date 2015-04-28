var through = require('through-gulp'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs');

//var REGEX_MAINFILE_URL = /(seajs\.use\((['"]))(.+)(\2)/mg;

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
            var map = JSON.parse(fileContent);
            var seajsMainData = null;

            var i = null;
            var fileContent = null;
            var dist = null;


            //todo common getFile plugin, pass param defined command data



            for(i in map){
                if(map.hasOwnProperty(i)){
                    seajsMainData = map[i].filter(function(data){
                        return data.command === "seajsMain";
                    })[0];


                    //todo common

                    var mainFilePath = path.join(process.cwd(), seajsMainData.fileUrlArr[0]);


                    dist = seajsMainData.dist;
                    fileContent = fs.readFileSync(mainFilePath, "utf8");

                    //var configPath = path.join(process.cwd(), "gulp/buildConfig.json");
                    //var buildConfig = JSON.parse(fs.readFileSync(configPath,"utf8"));


                    //fileContent = fileContent.replace(REGEX_MAINFILE_URL, function(fullMatch, p1, p2, p3, p4){
                    //    return p1 + convertToGulpCanReadPathByConfig(p3, buildConfig) + p4;
                    //});

                    var newFile = new Vinyl({
                        base: path.dirname(mainFilePath),
                        path: mainFilePath,
                        contents: new Buffer(fileContent)
                    });

                    //custom attr for gulp-seajs-combo to set dist path
                    newFile.dist = seajsMainData.dist;

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
        // just pipe data next, just callback to indicate that the stream's over
        //this.push(something);
        callback();
    });

    // returning the file stream
    return stream;
}

//todo move to common lib
//function convertToGulpCanReadPathByConfig(url, buildConfig){
//    var result = null;
//
//    buildConfig.seajsMainUrlMap.every(function(map){
//        if(url.indexOf(map.staticResourcePrefix) > -1){
//            result = url.replace(map.staticResourcePrefix, map.relativePrefix);
//            return false;
//        }
//        result = url;
//
//        return true;
//    });
//
//    return result;
//}






module.exports = getFileContent;

