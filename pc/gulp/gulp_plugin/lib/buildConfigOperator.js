var path = require("path"),
    fs = require("fs");

var operator = {
    read: function(){
        return JSON.parse(
            fs.readFileSync(path.resolve(process.cwd(), "gulp/buildConfig.json"), "utf8")
        );
    },
    //todo createBuildMap
    convertToPathRelativeToCwd:function(url, buildConfig){
    var result = null;

    buildConfig.urlMap.every(function(map){
        if(url.indexOf(map.staticResourcePrefix) > -1){
            result = url.replace(map.staticResourcePrefix, map.relativePrefix);
            return false;
        }
        result = url;

        return true;
    });

    return result;
}
};

module.exports = operator;

