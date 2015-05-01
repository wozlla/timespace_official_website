var gulp = require('gulp');
var gulpUglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
require("./createBuildMap");


var gulpGetSeajsMainFile = require('../gulp_plugin/getSeajsMainFile/index.js');
var gulpCombo = require('../lib/gulp-seajs-combo/index.js');

gulp.task('packSeajs', ['createBuildMap'], function () {

    return gulp.src('gulp/gulp_plugin/resourceMap.json')
        .pipe(plumber())
        .pipe(gulpGetSeajsMainFile())
        .pipe(gulpCombo({}))


        //todo uglify

        //just set to cwd path,the dest path is set by dist attr in resourceMap.json

        .pipe(gulp.dest('./'));
});


var gulpGetNoCmdJsFile = require('../gulp_plugin/getNoCmdJsFile/index.js'),
    gulpConcat = require('../gulp_plugin/concat/index.js');

gulp.task('packNoCmdJs', ['createBuildMap'], function () {
    return gulp.src('gulp/gulp_plugin/resourceMap.json')
        .pipe(plumber())
        //.pipe(buildJs())
        .pipe(gulpGetNoCmdJsFile())
        .pipe(gulpConcat())


        //just set to cwd path,the dest path is set by dist attr in resourceMap.json
        .pipe(gulp.dest('./'));
});

var gulpGetCssFile = require('../gulp_plugin/getCssFile/index.js');

gulp.task('packCss', ['createBuildMap'], function () {
    return gulp.src('gulp/gulp_plugin/resourceMap.json')
        .pipe(plumber())
        .pipe(gulpGetCssFile())
        .pipe(gulpConcat())


        //just set to cwd path,the dest path is set by dist attr in resourceMap.json
        .pipe(gulp.dest('./'));
});

gulp.task("pack", ["packSeajs", "packNoCmdJs", "packCss"]);

