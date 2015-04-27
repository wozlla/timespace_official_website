var gulp = require('gulp');

var clean = require('gulp-clean');

gulp.task('clean', function() {
    gulp.src('dist/*', {read: false})
        .pipe(clean());
});


var sass = require('gulp-sass');

gulp.task('compile', function() {
    //gulp.src(['public/css/*.scss', 'public/css/**/*.scss'])
    gulp.src(['public/css/*.scss', 'public/css/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

var gulpCopy = require('gulp-copy');

gulp.task('copy', function() {
    gulp.src('views/**/*')
        .pipe(gulpCopy('dist_views/', {prefix:1}));
});




//gulp.task('rewriteJs', function(){
//    gulp.src('dist_views/footer.ejs')
//        .pipe(gulpRewriteJs())
//        //.pipe(gulp.dest('dist_views/'));
//        .pipe(gulp.dest('test_views/'));
//        //.pipe(gulpGetJsUrlArr())
//        //.pipe(concat())
//        //.pipe(uglify())
//        //.pipe(gulp.dest('dist/'));
//});

//var gulpGetJsArr = require('./gulp_plugin/getJsArr'),
//    gulpConcat = require('gulp-concat'),
//    gulpUglify = require('gulp-uglify');
//
//gulp.task('buildJs', function(){
//    gulp.src('dist_views/footer.ejs')
//        .pipe(gulpGetJsArr())
//        .pipe(gulpConcat('footer.js'))
//        .pipe(gulpUglify())
//        .pipe(gulp.dest('dist/'));
//});


var createBuildMap = require('./gulp/gulp_plugin/createBuildMap/index.js');

gulp.task('createBuildMap', function(){
    gulp.src('dist_views/footer.ejs')
        .pipe(createBuildMap());
});





var gulpRewrite= require('./gulp/gulp_plugin/rewriteStaticResourceUrl/index.js');


gulp.task('rewriteStaticeResource',['createBuildMap'], function(){
    gulp.src('dist_views/footer.ejs')
        .pipe(gulpRewrite())
        .pipe(gulp.dest('test_views/'));
});
//
//var gulpGetSeajsMainFile = require('./gulp_plugin/getSeajsMainFile/index.js'),
//    gulpConcat = require('gulp-concat'),
//    gulpUglify = require('gulp-uglify'),
//    //gulpWrap = require('gulp-wrap'),
//    gulpWrap = require('./gulp_plugin/gulpWrap.js'),

//var  seajsCombo = require('gulp-seajs-combo');
var gulpCombo = require('./gulp/lib/gulp-seajs-combo/index.js');
//
//build seajs-combo dist.js
gulp.task('packSeajs', function(){
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
    //gulp.src('gulp/resourceMap.json')
    //    .pipe(gulpGetSeajsMainFile())
        //.pipe(gulpWrap('define(function(require, exports, module) = { <%=content%> });'))
        //.pipe(gulp.dest('test_views'));
    //gulp.src('gulp/gulp_plugin/getSeajsFileList/test/main.js')
    gulp.src(['gulp/gulp_plugin/getSeajsFileList/test/main.js',
    'gulp/main.js'],
        {base:'gulp/'})
    //gulp.src('gulp/gulp_plugin/getSeajsFileList/test/a.js')
    //gulp.src('gulp/src/m.js')
        .pipe(gulpCombo({
            //add options by yyc
            //mainUrlMap: ['/js', '../public/js'],
            //name: 'footer.js',



            //plugins : [{
            //    ext : [ '.js' ],
            //    use : [{
            //        plugin : gulpWrap,
            //        param : ['define(function(require, exports, module) = { <%=contents%> });']
            //    }]
            //}]
        }))
        //use rename plugin
        //.pipe(gulpRename("footer.js"))
        .pipe(gulp.dest('test_views/'));
});
//
//
//
//gulp.task('packNoCmdJs', function() {
//    gulp.src('gulp/resourceMap.json')
//        //.pipe(buildJs())
//        .pipe(gulpSrc())
//        .pipe(gulpConcat())
//        .pipe(gulpUglify())
//        .pipe(gulp.dest('test_views'));
//});
//

//todo build css







//var gulpGetJsUrlArr = require('./gulp_plugin/rewriteJs');

//gulp.task('buildjs', function(){
//    gulp.src('dist_views/footer.ejs')
//        .pipe(gulpRewriteJs())
//        .pipe(gulp)
//        //.pipe(gulp.dest('dist_views/'));
//        .pipe(gulp.dest('dist/'));
//});


//gulp.task('default', ['createBuildMap']);

//gulp.task('default', ['createBuildMap', 'rewriteStaticeResource']);
//gulp.task('default', ['rewriteStaticeResource']);
gulp.task('default', ['packSeajs']);


//todo build css
gulp.task('build', ['clean', 'compile',
'copy', 'createBuildMap', 'rewriteStaticeResource',
'packSeajs', 'packNoCmdJs']);
