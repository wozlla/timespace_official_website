var path = require('path');

/*!
fileUrl is relative to cwd path
dist is relative to dist dir(specified by gulp.dest in gulpfile)
 */
var operator = {
    seajs: {
        parse: function(mapData){
            var seajsData = mapData.filter(function(data){
                return data.command === "seajsMain";
            })[0];

            return {
                dist: seajsData.dist,
                mainFilePath: path.join(process.cwd(), seajsData.fileUrlArr[0])
            }
        }
    }
};

module.exports = operator;
