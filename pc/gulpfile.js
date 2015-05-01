var gulp = require('gulp');

require("./gulp/gulp_task/rewrite");
require("./gulp/gulp_task/pack");

gulp.task("build", ["pack", "rewrite"]);
