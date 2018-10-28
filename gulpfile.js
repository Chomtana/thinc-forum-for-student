var gulp = require("gulp");
var pug = require('./gulp-pug.js');

global.require = require;
global.srcAbsolutePath = __dirname+"/src";
global.indextitle = "Skill list";
 
gulp.task('compilepug', function () {
  return gulp.src('public/**/*.pug')
  .pipe(pug({
    globals:["require"]
  }))
  .pipe(gulp.dest('public'));
});

gulp.task('compilepug:watch', function () {
  gulp.watch('public/**/*.pug', gulp.series('compilepug'));
});

var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('public/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('public'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('public/**/*.scss', gulp.series('sass'));
});

gulp.task('compile',gulp.parallel('sass','compilepug'));
gulp.task('compile:watch',gulp.parallel('sass:watch','compilepug:watch'));