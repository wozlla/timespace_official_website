var gulp = require('gulp');
var gulpUglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
require("./createBuildMap");



var gulpGetSeajsMainFile = require('../gulp_plugin/getSeajsMainFile/index.js');
//    gulpConcat = require('gulp-concat'),
//    gulpUglify = require('gulp-uglify'),
//    //gulpWrap = require('gulp-wrap'),
//    gulpWrap = require('./gulp_plugin/gulpWrap.js'),

//var  gulpCombo = require('gulp-seajs-combo');
var gulpCombo = require('../lib/gulp-seajs-combo/index.js');
//
//build seajs-combo dist.js
gulp.task('packSeajs', ['createBuildMap'], function(){
    //gulp.src('dist_views/*')
    //    .pipe(gulpWrap('define(function(require, exports, module) = { <%=content%> });'))
    //    .pipe(gulp.dest('test_vies/'));
    //gulp.src('dist_views/footer.ejs')
    //    .pipe(gulpGetSeajsFileList())
    //    .pipe(gulpSrc())
    //    .pipe(gulpWrap('define(function(require, exports, module) = { <%=content%> });'))
    //    .pipe(gulpConcat())
    //    .pipe(gulpUglify())
    //    .pipe(gulp.dest('test_views'));
    //
    //
    return gulp.src('gulp/resourceMap.json')
        .pipe(plumber())
        .pipe(gulpGetSeajsMainFile())
        //.pipe(gulpWrap('define(function(require, exports, module) = { <%=content%> });'))
        //.pipe(gulp.dest('test_views'));
        //gulp.src('gulp/gulp_plugin/getSeajsFileList/test/main.js')
        //gulp.src(['gulp/gulp_plugin/getSeajsFileList/test/main.js',
        //'gulp/main.js'],
        //    {base:'gulp/'})
        //gulp.src('gulp/gulp_plugin/getSeajsFileList/test/a.js')
        //gulp.src('gulp/src/m.js')
        .pipe(gulpCombo({
            //add options by yyc
            //mainUrlMap: ['/js', '../public/js'],
            //name: 'footer.js',


            //map:{
            //    "./index.js": "../public/js/website/index/index.js"
            //}

            //plugins : [{
            //    ext : [ '.js' ],
            //    use : [{
            //        plugin : gulpWrap,
            //        param : ['define(function(require, exports, module) = { <%=contents%> });']
            //    }]
            //}]
        }))
        //.pipe(gulpRename(function (path) {
        //    path.dirname += "/ciao";
        //    path.basename += "-goodbye";
        //    path.extname = ".md"
        //}))

        //use rename plugin
        //.pipe(gulpRename("footer.js"))



        //todo uglify

        //just set to cwd path,the dest path is set by dist attr in resourceMap.json

        .pipe(gulp.dest('./'));
});



var gulpGetNoCmdJsFile = require('../gulp_plugin/getNoCmdJsFile/index.js');
//gulpConcat = require('gulp-concat');
gulpConcat = require('../gulp_plugin/concat/index.js');

gulp.task('packNoCmdJs',['createBuildMap'], function() {
    return gulp.src('gulp/resourceMap.json')
        .pipe(plumber())
        //.pipe(buildJs())
        .pipe(gulpGetNoCmdJsFile())
        .pipe(gulpConcat())


        //just set to cwd path,the dest path is set by dist attr in resourceMap.json
        .pipe(gulp.dest('./'));
});

var gulpGetCssFile = require('../gulp_plugin/getCssFile/index.js');

gulp.task('packCss',['createBuildMap'], function() {
    return gulp.src('gulp/resourceMap.json')
        .pipe(plumber())
        .pipe(gulpGetCssFile())
        .pipe(gulpConcat())


        //just set to cwd path,the dest path is set by dist attr in resourceMap.json
        .pipe(gulp.dest('./'));
});

gulp.task("pack", ["packSeajs", "packNoCmdJs", "packCss"]);

