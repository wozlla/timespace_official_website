var gulp = require('gulp');

require("./gulp/gulp_task/rewrite");
require("./gulp/gulp_task/pack");
require("./gulp/gulp_task/server");

gulp.task("build", ["pack", "rewrite"]);
gulp.task("default", ["rewrite"]);
