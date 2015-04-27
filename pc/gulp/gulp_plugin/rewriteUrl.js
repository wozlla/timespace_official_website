var through = require('through-gulp'),
    gutil = require('gulp-util');

var errorFunc = null;


function rewriteJs() {
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


            //file.contents = handleContent(fileContent, convertToProducePath(extendDeep(jsData)));
            //file.contents = handleContent(fileContent, extendDeep(jsData));
            file.contents = new Buffer(handleContent(fileContent));

        }
        if (file.isStream()) {
            errorFunc('Streaming not supported');
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }





        //var jsData = parse(fileContent);
        //
        //var relativeData = convertToRelativePath(jsData);
        ////todo judge command:seajs
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





//function extendDeep(parent, child) {
//    var i = null,
//        len = 0,
//        toStr = Object.prototype.toString,
//        sArr = "[object Array]",
//        sOb = "[object Object]",
//        type = "",
//        _child = null;
//
//    //数组的话，不获得Array原型上的成员。
//    if (toStr.call(parent) === sArr) {
//        _child = child || [];
//
//        for (i = 0, len = parent.length; i < len; i++) {
//            type = toStr.call(parent[i]);
//            if (type === sArr || type === sOb) {    //如果为数组或object对象
//                _child[i] = type === sArr ? [] : {};
//                arguments.callee(parent[i], _child[i]);
//            } else {
//                _child[i] = parent[i];
//            }
//        }
//    }
//    //对象的话，要获得原型链上的成员。因为考虑以下情景：
//    //类A继承于类B，现在想要拷贝类A的实例a的成员（包括从类B继承来的成员），那么就需要获得原型链上的成员。
//    else if (toStr.call(parent) === sOb) {
//        _child = child || {};
//
//        for (i in parent) {
//            type = toStr.call(parent[i]);
//            if (type === sArr || type === sOb) {    //如果为数组或object对象
//                _child[i] = type === sArr ? [] : {};
//                arguments.callee(parent[i], _child[i]);
//            } else {
//                _child[i] = parent[i];
//            }
//        }
//    }
//    else {
//        _child = parent;
//    }
//
//    return _child;
//}



function parse(content){
    var beginRegex = /#build:js:([^\s]+)\s([^#]+)/gm,
        endRegex = /#endbuild#/gm,
        endDataArr = null,
        dataArr = null,
        command = null,
        distUrl = null,
        fileUrlArr = null,
        result = {};

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

function convertToRelativePath(jsData){
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

function handleContent(content){
    var beginRegex = /[^\n\r]+#build:js:([^\s]+)\s([^#]+)[^\n\r]*/gm,
        endRegex = /[^\n\r]+#endbuild#[^\n\r]+/gm,
        commond = null,
        distUrl = null,
        endDataArr = null,
        dataArr = null,
        result = null;


    while((dataArr = beginRegex.exec(content)) !== null) {
        command = dataArr[1];
        distUrl = dataArr[2];

        endDataArr = endRegex.exec(content.slice(dataArr.lastIndex));

        if(endDataArr === null){
            errorFunc("should define #endbuild#");
            return;
        }

        switch(command){
            case "replace":
                result = content.slice(0, dataArr.index)
                + "<script src='" + distUrl + "'></script>"
                + content.slice(endDataArr.index + endDataArr[0].length);
                break;
            //todo support more command
            default:
                break;
        }

        //fileUrlArr = _getFileUrlArr(content.slice(dataArr.lastIndex, endIndex));
        //
        //result[command] = {
        //    dist: distUrl,
        //    fileUrlArr: fileUrlArr
        //};
    }

    return result;
}


function buildJs(urlArr){

}



module.exports = rewriteJs;