var path = require("path"),
    fs = require("fs"),
    buildConfigOperator = require("./buildConfigOperator");

/*!
 note:
 fileUrl is relative to cwd path
 ////dist is relative to dist dir(specified by gulp.dest in gulpfile)
 seajs.use -> path should like "/pc/js/xxx"

 */

var seajs = {
    getData: function (mapData) {
        var i = null,
            result = [];

        for (i in mapData) {
            if (mapData.hasOwnProperty(i)) {
                mapData[i].forEach(function (data) {
                    if (data.command === "seajsMain") {
                        result.push(data)
                    }
                });
            }
        }

        return result;
    },
    parse: function (seajsData) {
        return {
            dist: this._convertDistPathRelativeToCwd(seajsData.dist),
            mainFilePath: path.join(process.cwd(), seajsData.fileUrlArr[0])
        }
    },
    _convertDistPathRelativeToCwd: function (dist) {
        var buildConfig = buildConfigOperator.read();

        return buildConfigOperator.convertToPathRelativeToCwd(dist, buildConfig);
    }
};

var noCmdJs = {
    getData: function (mapData) {
        var i = null,
            result = [];

        for (i in mapData) {
            if (mapData.hasOwnProperty(i)) {
                mapData[i].forEach(function (data) {
                    if (data.command !== "seajsMain") {
                        result.push(data)
                    }
                });
            }
        }

        return result;
    },
    parse: function (jsData) {
        var pathArr = [];

        jsData.fileUrlArr.forEach(function (url) {
            pathArr.push(path.join(process.cwd(), url));
        });

        return {
            dist: this._convertDistPathRelativeToCwd(jsData.dist),
            filePathArr: pathArr
        }
    },
    _convertDistPathRelativeToCwd: function (dist) {
        var buildConfig = buildConfigOperator.read();

        return buildConfigOperator.convertToPathRelativeToCwd(dist, buildConfig);
    }
};

module.exports = {
    read: function () {
        return JSON.parse(
            fs.readFileSync(path.resolve(process.cwd(), "gulp/resourceMap.json"), "utf8")
        );
    },
    write:function(contents){
        fs.writeFileSync(
            path.join(process.cwd(), "gulp/resourceMap.json"),
            contents);
    },
    seajs: seajs,
    noCmdJs: noCmdJs
};
