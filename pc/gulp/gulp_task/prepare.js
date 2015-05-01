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

gulp.task("prepare", ["clean", "compile", "copy"]);
