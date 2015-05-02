var gulp = require('gulp');

var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});


var sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('compile', function () {
    return gulp.src(['public/css/*.scss', 'public/css/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css/'));
});

var gulpCopy = require('gulp-copy');

gulp.task('copy', function () {
    gulp.src('views/**/*')
        .pipe(gulpCopy('dist_views/', {prefix: 1}));
});

gulp.task("prepare", ["clean", "compile", "copy"]);
