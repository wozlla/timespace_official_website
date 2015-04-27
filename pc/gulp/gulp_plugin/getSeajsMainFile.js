var through = require('through-gulp'),
    gutil = require('gulp-util'),
    fs = require('fs');

var errorFunc = null;


function getSeajsMainFile() {
    // creating a stream through which each file will pass
    var stream = through(function(file, encoding,callback) {
        var self = this;

        errorFunc = function(msg){
            self.emit('error', new gutil.PluginError(PLUGIN_NAME, msg));
        }

        // do whatever necessary to process the file
        if (file.isNull()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        if (file.isBuffer()) {
            var fileContent = file.contents.toString();

            ////todo reuse parse method
            //var jsData = parseMain(fileContent);
            //
            //var relativeDataArr = convertToRelativePathArr(jsData);
            //var jsContentArr = readFile(relativeDataArr);
            //var bufferArr = [];
            //jsContentArr.forEach(function(data){
            //    bufferArr.push(new Buffer(data));
            //});
            //file.contents =  Buffer.concat(bufferArr);
            file.contents = new Buffer(
                fs.readFileSync("public/js/website/index/main.js")
            );

        }
        if (file.isStream()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }


        //todo judge command:seajs
        //buildJs(relativeData);


        //var content = pp.preprocess(file.contents.toString(), options || {});
        //file.contents = new Buffer(content);

        // just pipe data next, or just do nothing to process file later in flushFunction
        // never forget callback to indicate that the file has been processed.
        this.push(file);
        callback();
    },function(callback) {
        // just pipe data next, just callback to indicate that the stream's over
        //this.push(something);
        callback();
    });

    // returning the file stream
    return stream;
}



function parseMain(content){
    //var beginRegex = /#build:js:([^\s]+)\s([^#]+)/gm,
    //    endRegex = /#endbuild#/gm,
    //    endDataArr = null,
    //    dataArr = null,
    //    command = null,
    //    distUrl = null,
    //    fileUrlArr = null,
    //    result = {};
    var beginRegex = /#build:js:seajsMain([^\s]+)\s([^#]+)/gm,
        endRegex = /#endbuild#/gm,
        endDataArr = null,
        dataArr = null,
        command = null,
        distUrl = null,
        fileUrlArr = null,
        result = {};


    //there is only one main
    //todo multi main?
    dataArr = beginRegex.exec(content);

    command = dataArr[1];
    distUrl = dataArr[2];

    endDataArr = endRegex.exec(content.slice(dataArr.lastIndex));

    if(endDataArr === null){
        errorFunc("should define #endbuild#");
        return;
    }

    fileUrlArr = _getFileUrlArr(content.slice(dataArr.index + dataArr[0].length, endDataArr.index));

    result[command] = {
        dist: distUrl,
        fileUrlArr: fileUrlArr
    };




    while((dataArr = beginRegex.exec(content)) !== null) {
        command = dataArr[1];
        distUrl = dataArr[2];

        endDataArr = endRegex.exec(content.slice(dataArr.lastIndex));

        if(endDataArr === null){
            errorFunc("should define #endbuild#");
            return;
        }

        fileUrlArr = _getFileUrlArr(content.slice(dataArr.index + dataArr[0].length, endDataArr.index));

        result[command] = {
            dist: distUrl,
            fileUrlArr: fileUrlArr
        };
    }

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



var map = require('./map.json');

function convertToRelativePathArr(jsData){
    var result = [],
        fileUrlArr = null;

    //only replace data need to be converted
    if(!jsData.replace){
        return result;
    }

    fileUrlArr = jsData.replace.fileUrlArr;

    fileUrlArr.forEach(function(url){
        result.push(url.replace(map.relativeMap[0], map.relativeMap[1]));
    });

    return result;
}

//function convertToProducePath(data){
//    var i = null;
//
//    for(i in data){
//        if(data.hasOwnProperty(i)){
//            data[i].dist
//
//            data[i].fileUrlArr.forEach(function(url){
//
//            });
//        }
//    }
//}

function readFile(urlArr){
    var contentArr = [];

    urlArr.forEach(function(url){
        contentArr.push(fs.readFileSync(url));
    });

    return contentArr;
}

module.exports = getSeajsMainFile;

