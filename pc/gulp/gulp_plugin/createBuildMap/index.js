var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs');


var errorFunc = null;

var REGEX_BEGINE= /[^\r\n]+#build:js:([^\s]+)\s([^#]+)[^\r\n]+/gm,
    REGEX_END = /[^\r\n]+#endbuild#[^\r\n]+/gm,
    PLUGIN_NAME = "createBuildMap";

var result = {};

function createBuildMap() {
    // creating a stream through which each file will pass
    return through(function(file, encoding,callback) {
        var self = this;

        errorFunc = function(msg){
            gutil.log(msg);
            self.emit('error', new gutil.PluginError(PLUGIN_NAME, msg));
        }

        // do whatever necessary to process the file
        if (file.isNull()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var filePath = file.path;


            var configPath = path.join(process.cwd(), "gulp/buildConfig.json");
            var buildConfig = JSON.parse(fs.readFileSync(configPath));




            var pageMapArr = parse(fileContent, buildConfig);

            convertToGulpCanReadPath(pageMapArr, buildConfig);

            //filePath as id
            result[filePath] = pageMapArr;

            //this.push(file)
            callback();

        }
        //todo support stream
        if (file.isStream()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }


        ////todo judge command:seajs
        //buildJs(relativeData);


        //var content = pp.preprocess(file.contents.toString(), options || {});
        //file.contents = new Buffer(content);

        // just pipe data next, or just do nothing to process file later in flushFunction
        // never forget callback to indicate that the file has been processed.
        //this.push(file);
        //callback();
    },function(callback) {
        var self = this;

        fs.writeFile(
            path.join(process.cwd(), "gulp/resourceMap.json"),
            JSON.stringify(result), function(e){
            if(e){
                gutil.log(e.message);
                self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
            }

            callback();
        });
        // just pipe data next, just callback to indicate that the stream's over
        //this.push(something);
        //callback();
    });

    // returning the file stream
    return stream;
}


function parse(content, buildConfig){
        var endDataArr = null,
        dataArr = null,
        command = null,
        distUrl = null,
        fileUrlArr = null,
            segmentData = null,
            result = [];

    while((dataArr = REGEX_BEGINE.exec(content)) !== null) {
        segmentData = {};

        command = dataArr[1];
        distUrl = convertToGulpCanReadPathByConfig(dataArr[2], buildConfig);

        endDataArr = REGEX_END.exec(content);

        if(endDataArr === null){
            errorFunc("should define #endbuild#");
            return;
        }

        //REGEX_END.lastIndex = 0;

        fileUrlArr = _getFileUrlArr(content.slice(dataArr.index + dataArr[0].length, endDataArr.index));

        segmentData["command"] = command;
        segmentData["dist"] = distUrl;
        segmentData["fileUrlArr"] = fileUrlArr;
        segmentData["startLine"] = dataArr.index;
        segmentData["endLine"] = endDataArr.index + endDataArr[0].length;

        result.push(segmentData);
    }

    //restore regex
    REGEX_BEGINE.lastIndex = 0;
    REGEX_END.lastIndex = 0;

    return result;
}

function _getFileUrlArr(content){
    var regex = /src="([^"]+)"/mg,
        dataArr = null,
        result = [];

    while((dataArr = regex.exec(content)) !== null) {
        result.push(dataArr[1]);
    }

    return result;
}




function convertToGulpCanReadPath(pageMapArr, buildConfig){
    pageMapArr.forEach(function(mapData){
        if(!mapData.fileUrlArr){
            return;
        }

        mapData.fileUrlArr = mapData.fileUrlArr.map(function(url){
            return convertToGulpCanReadPathByConfig(url, buildConfig);
        });
    });
}

function convertToGulpCanReadPathByConfig(url, buildConfig){
    var result = null;

    buildConfig.urlMap.every(function(map){
        if(url.indexOf(map.staticResourcePrefix) > -1){
            result = url.replace(map.staticResourcePrefix, map.relativePrefix);
            return false;
        }

        return true;
    });

    return result;
}


module.exports = createBuildMap;

