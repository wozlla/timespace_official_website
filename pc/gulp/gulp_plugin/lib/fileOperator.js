    var Vinyl = require('vinyl'),
    path = require('path'),
    fs = require('fs');

    var operator = {
        createFile: function(args){
            var pathData = null,
                contents = null;

            if(arguments.length === 2){
                contents = arguments[0];
                pathData = this._makeRelativeToCwd(arguments[1]);
            }
            else if(arguments.length === 3){
                contents = arguments[0];
                pathData = {
                    base:arguments[1],
                    path: arguments[2]
                };
            }

            return new Vinyl({
                base: pathData.base,
                path: pathData.path,
                contents: contents
            });
        },
        _makeRelativeToCwd:function(url){
        //path is dist path
        //writePath should be seajsMainData.dist

        //reference:
        // gulp.dest code:vinyl-fs/lib/dest/index.js:

        //function dest(outFolder, opt) {
        //    opt = opt || {};
        //    if (typeof outFolder !== 'string' && typeof outFolder !== 'function') {
        //        throw new Error('Invalid output folder');
        //    }
        //
        //    var options = defaults(opt, {
        //        cwd: process.cwd()
        //    });
        //
        //    if (typeof options.mode === 'string') {
        //        options.mode = parseInt(options.mode, 8);
        //    }
        //
        //    var cwd = path.resolve(options.cwd);
        //
        //    function saveFile (file, enc, cb) {
        //        var basePath;
        //        if (typeof outFolder === 'string') {
        //            basePath = path.resolve(cwd, outFolder);
        //        }
        //        if (typeof outFolder === 'function') {
        //            basePath = path.resolve(cwd, outFolder(file));
        //        }
        //        var writePath = path.resolve(basePath, file.relative);
        return {base: process.cwd(),
            path: path.resolve(process.cwd(), url)
        }
    }
    };

    module.exports = operator;
