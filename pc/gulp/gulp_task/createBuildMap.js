var gulp = require('gulp');
var plumber = require('gulp-plumber');
require("./prepare");



var createBuildMap = require('../gulp_plugin/createBuildMap/index.js');

gulp.task('createBuildMap',["prepare"], function(){
    return gulp.src('dist_views/**/*.ejs')
    //return gulp.src('dist_views/website/index.ejs')
        .pipe(plumber())
        .pipe(createBuildMap());
});


