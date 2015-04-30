var through = require('through-gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
buildConfigOperator = require('../lib/buildConfigOperator');


var REGEX_BEGINE= /[^\r\n]+#build:js:([^\s]+)\s([^#]+)[^\r\n]+/gm,
    REGEX_END = /[^\r\n]+#endbuild#[^\r\n]+/gm,
    //[^\1] 匹配失败!!!why?
    //REGEX_URL = /src=(['"])([^\1]+)\1/mg,
    REGEX_URL = /src=(['"])(.+)\1/mg,
    PLUGIN_NAME = "createBuildMap";

var result = {};

//todo filter annotated script
function createBuildMap() {
    return through(function(file, encoding,callback) {
        if (file.isNull()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();
            var filePath = file.path;


            var configPath = path.join(process.cwd(), "gulp/buildConfig.json");
            var buildConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

            var pageMapArr = parse(fileContent, buildConfig, this);

            convertToGulpCanReadPath(pageMapArr, buildConfig);

            //filePath as id
            result[filePath] = pageMapArr;

            //this.push(file)
            callback();

        }
        //todo support stream
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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
        fs.writeFileSync(
            path.join(process.cwd(), "gulp/resourceMap.json"),
            JSON.stringify(result));

        //, function(e){
        //    if(e){
        //        gutil.log(e.message);
        //        self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
            //}

            callback();
        //}


       //todo why it'll start rewrite task when not invoking callback here
       // (mean not finishing createBuildMap task!)

        //fs.writeFile(
        //    path.join(process.cwd(), "gulp/resourceMap.json"),
        //    JSON.stringify(result)
        //, function(e){
        //    if(e){
        //        gutil.log(e.message);
        //        self.emit('error', new gutil.PluginError(PLUGIN_NAME, e.message));
        //}
        //
        //        callback();
        //});
    });

    // returning the file stream
    return stream;
}


function parse(content, buildConfig, stream){
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
        distUrl = buildConfigOperator.convertToPathRelativeToCwd(dataArr[2], buildConfig);
        //distUrl = convertToGulpCanReadPathByConfig(dataArr[2], buildConfig);

        endDataArr = REGEX_END.exec(content);

        if(endDataArr === null){
            stream.emit('error', new gutil.PluginError(PLUGIN_NAME, "should define #endbuild#"));
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
        var dataArr = null,
        result = [];

    while((dataArr = REGEX_URL.exec(content)) !== null) {
        result.push(dataArr[2]);
    }

    return result;
}

function convertToGulpCanReadPath(pageMapArr, buildConfig){
    pageMapArr.forEach(function(mapData){
        if(!mapData.fileUrlArr){
            return;
        }

        mapData.fileUrlArr = mapData.fileUrlArr.map(function(url){
            return buildConfigOperator.convertToPathRelativeToCwd(url, buildConfig);
        });
    });
}


module.exports = createBuildMap;

