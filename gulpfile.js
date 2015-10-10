var gulp = require("gulp");
var browserify = require("gulp-browserify");
 
gulp.task("scripts", function() {
    return gulp.src("public/javascripts/index.js")
        .pipe(browserify())
        .pipe(gulp.dest("./dist/javascripts"));
});

gulp.task("watch", function () {
    gulp.watch("public/javascripts/**/*.js", ["scripts"]);
});

gulp.task("default", ["watch", "scripts"]);


