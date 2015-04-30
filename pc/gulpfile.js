var gulp = require('gulp');

var clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});


var sass = require('gulp-sass');

gulp.task('compile', function() {
    //gulp.src(['public/css/*.scss', 'public/css/**/*.scss'])
    return gulp.src(['public/css/*.scss', 'public/css/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

var gulpCopy = require('gulp-copy');

gulp.task('copy', function() {
    //gulp.src('views/**/*')
    return gulp.src(['views/website/index.ejs', 'views/website/footer.ejs'])
        .pipe(gulpCopy('dist_views/', {prefix:1}));
});




//todo build css



gulp.task("prepare", ["clean", "compile", "copy"]);


var createBuildMap = require('./gulp/gulp_plugin/createBuildMap/index.js');
var plumber = require('gulp-plumber');

gulp.task('createBuildMap',["prepare"], function(){
     //gulp.task('createBuildMap',function(){
    //gulp.src('dist_views/footer.ejs')
    return gulp.src('dist_views/**/*.ejs')
        .pipe(plumber())
        .pipe(createBuildMap());
});



var gulpRewrite= require('./gulp/gulp_plugin/rewriteStaticResourceUrl/index.js');


gulp.task('rewriteStaticeResource',['createBuildMap'], function(){
    //gulp.task('rewriteStaticeResource', function(){
    //gulp.task('rewriteStaticeResource',[], function(){
    return gulp.src('dist_views/**/*.ejs')
        .pipe(plumber())
        .pipe(gulpRewrite())
        .pipe(gulp.dest('dist_views/'));
});
//
var gulpGetSeajsMainFile = require('./gulp/gulp_plugin/getSeajsMainFile/index.js');
//    gulpConcat = require('gulp-concat'),
//    gulpUglify = require('gulp-uglify'),
//    //gulpWrap = require('gulp-wrap'),
//    gulpWrap = require('./gulp_plugin/gulpWrap.js'),

//var  gulpCombo = require('gulp-seajs-combo');
var gulpCombo = require('./gulp/lib/gulp-seajs-combo/index.js');
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



var gulpGetNoCmdJsFile = require('./gulp/gulp_plugin/getNoCmdJsFile/index.js');
//gulpConcat = require('gulp-concat');
gulpConcat = require('./gulp/gulp_plugin/concat/index.js');
var gulpUglify = require('gulp-uglify');
//    //gulpWrap = require('gulp-wrap'),
//    gulpWrap = require('./gulp_plugin/gulpWrap.js'),

//var  gulpCombo = require('gulp-seajs-combo');
gulp.task('packNoCmdJs',['createBuildMap'], function() {
    return gulp.src('gulp/resourceMap.json')
        .pipe(plumber())
        //.pipe(buildJs())
        .pipe(gulpGetNoCmdJsFile())
        .pipe(gulpConcat())


        //just set to cwd path,the dest path is set by dist attr in resourceMap.json
        .pipe(gulp.dest('./'));
});


gulp.task("rewrite", ["rewriteStaticeResource"])

gulp.task("pack", ["packSeajs", "packNoCmdJs"]);

gulp.task("build", ["pack", "rewrite"]);


//var gulpsync = require('gulp-sync')(gulp);

//gulp.task('default', gulpsync.sync(['createBuildMap' ,'rewrite']));



//todo build css
//gulp.task('build', ['clean', 'compile',
//'copy', 'createBuildMap', 'rewriteStaticeResource',
//'packSeajs', 'packNoCmdJs']);
