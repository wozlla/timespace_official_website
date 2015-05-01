var through = require("through-gulp"),
    gutil = require("gulp-util"),
    path = require("path"),
    fs = require("fs"),
    buildConfigOperator = require("../lib/buildConfigOperator"),
mapOperator = require("../lib/resourceMapOperator");

var REGEX_BEGINE= /[^\r\n]+#build:js:([^\s]+)\s([^\s#]+)[^\r\n]+/gm,
    REGEX_END = /[^\r\n]+#endbuild#[^\r\n]+/gm,
//[^\1] 匹配失败!!!why?
//REGEX_URL = /src=(['"])([^\1]+)\1/mg,
    REGEX_URL = /src=(['"])(.+?)\1/mg,
    PLUGIN_NAME = "createBuildMap";


//todo filter annotated script
function createBuildMap() {
    var result = {};

    return through(function(file, encoding,callback) {
        var fileContent = null,
            filePath = null,
            buildConfig = null;

        if (file.isNull()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        if (file.isBuffer()) {
            fileContent = file.contents.toString();
            filePath = file.path;
            buildConfig = buildConfigOperator.read();

            //filePath as id
            //result[filePath] = [];
            result[filePath] = _parseCss(fileContent, buildConfig, this).concat(
                _parseJs(fileContent, buildConfig, this)
            );
            //result[filePath] = _parseJs(fileContent, buildConfig, this);

            callback();
        }
        //todo support stream
        if (file.isStream()) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
    },function(callback) {
        mapOperator.write(JSON.stringify(result));

        callback();

        //todo why it'll start rewrite task when not invoking callback here
        // (mean not finishing createBuildMap task!)

        //fs.writeFile(
        //    path.join(process.cwd(), "gulp/resourceMap.json"),
        //    JSON.stringify(result)
        //, function(e){
        //    if(e){
        //        gutil.log(e.message);
        //        self.emit("error", new gutil.PluginError(PLUGIN_NAME, e.message));
        //}
        //
        //        callback();
        //});
    });

    return stream;
}


function _parseJs(content, buildConfig, stream){
    var endDataArr = null,
        buildDataArr = null,
        buildIndex = null,
        endIndex = null,
        command = null,
        distUrl = null,
        fileUrlArr = null,
        segmentData = null,
        result = [];

    buildDataArr = REGEX_BEGINE.exec(content);

    while(buildDataArr !== null) {
        segmentData = {};
        buildIndex = buildDataArr.index;

        command = buildDataArr[1];
        distUrl = buildConfigOperator.convertToPathRelativeToCwd(buildDataArr[2], buildConfig);

        endDataArr = REGEX_END.exec(content.slice(buildDataArr.index));

        if(endDataArr === null){
            stream.emit("error", new gutil.PluginError(PLUGIN_NAME, "should define #endbuild#"));
            return;
        }

        endIndex = buildIndex + endDataArr.index;

        fileUrlArr = _getFileUrlArr(
            content.slice(buildIndex + buildDataArr[0].length, endIndex),
            buildConfig,
            REGEX_URL
        );

        segmentData["command"] = command;
        segmentData["dist"] = distUrl;
        segmentData["fileUrlArr"] = fileUrlArr;
        segmentData["startLine"] = buildIndex;
        segmentData["endLine"] = endIndex + endDataArr[0].length;
        segmentData["type"] = "js";

        result.push(segmentData);

        buildDataArr = REGEX_BEGINE.exec(content);

        //restore regex
        REGEX_END.lastIndex = 0;
    }

    //restore regex
    REGEX_BEGINE.lastIndex = 0;
    REGEX_END.lastIndex = 0;

    return result;
}
function _parseCss(content, buildConfig, stream){
    var endDataArr = null,
        buildDataArr = null,
        buildIndex = null,
        endIndex = null,
        command = null,
        distUrl = null,
        fileUrlArr = null,
        segmentData = null,
        result = [];

    var REGEX_BEGINE= /[^\r\n]+#build:css:([^\s]+)\s([^\s#]+)[^\r\n]+/gm,
        REGEX_END = /[^\r\n]+#endbuild#[^\r\n]+/gm;

    buildDataArr = REGEX_BEGINE.exec(content);

    while(buildDataArr !== null) {
        segmentData = {};
        buildIndex = buildDataArr.index;

        command = buildDataArr[1];
        distUrl = buildConfigOperator.convertToPathRelativeToCwd(buildDataArr[2], buildConfig);

        endDataArr = REGEX_END.exec(content.slice(buildDataArr.index));

        if(endDataArr === null){
            stream.emit("error", new gutil.PluginError(PLUGIN_NAME, "should define #endbuild#"));
            return;
        }

        endIndex = buildIndex + endDataArr.index;

        fileUrlArr = _getFileUrlArr(
            content.slice(buildIndex + buildDataArr[0].length, endIndex),
            buildConfig,
        /href=(['"])(.+?)\1/mg
        );

        segmentData["command"] = command;
        segmentData["dist"] = distUrl;
        segmentData["fileUrlArr"] = fileUrlArr;
        segmentData["startLine"] = buildIndex;
        segmentData["endLine"] = endIndex + endDataArr[0].length;
        segmentData["type"] = "css";

        result.push(segmentData);

        buildDataArr = REGEX_BEGINE.exec(content);

        //restore regex
        REGEX_END.lastIndex = 0;
    }

    //restore regex
    REGEX_BEGINE.lastIndex = 0;
    REGEX_END.lastIndex = 0;

    return result;
}

function _getFileUrlArr(content, buildConfig, regex_url){
    var dataArr = null,
        result = [];

    while((dataArr = regex_url.exec(content)) !== null) {
        result.push(buildConfigOperator.convertToPathRelativeToCwd(dataArr[2], buildConfig));
    }

    return result;
}

module.exports = createBuildMap;

