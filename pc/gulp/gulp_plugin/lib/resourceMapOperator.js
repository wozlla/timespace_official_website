var path = require('path'),
    fs = require('fs'),
    buildConfigOperator = require('./buildConfigOperator');

/*!
note:
fileUrl is relative to cwd path
////dist is relative to dist dir(specified by gulp.dest in gulpfile)
seajs.use -> path should like "/pc/js/xxx"

 */
var operator = {
    seajs: {
        getData: function(mapData){
            var i = null,
                result = [];

            for(i in mapData){
                if(mapData.hasOwnProperty(i)){
                    mapData[i].forEach(function(data){
                        if(data.command === "seajsMain"){
                            result.push(data)
                        }
                    });
                }
            }

            return result;
        },
        parse: function(seajsData){
            return {
                dist: this._convertDistPathRelativeToCwd(seajsData.dist),
                mainFilePath: path.join(process.cwd(), seajsData.fileUrlArr[0])
            }
        },
        _convertDistPathRelativeToCwd: function(dist){
            var buildConfig = buildConfigOperator.read();

            return buildConfigOperator.convertToPathRelativeToCwd(dist, buildConfig);
        }
    }
};

module.exports = operator;
