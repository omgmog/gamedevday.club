var deploy = require('gulp-gh-pages');
var gulp = require('gulp');
var jade = require('gulp-jade');
var replaceExtension = require('gulp-ext-replace');
var sass = require('gulp-sass');
var fs = require('fs');

var paths = {
  dist: './dist/',
  allDist: './dist/**/*',
  src: './src/',
  allSrc: './src/**/*',
  jadeSrc: './src/*.jade',
  sassSrc: './src/*.scss',
  ymlSrc: './src/data.yml',
  ignore: '!**/_*/**'
};


gulp.task('build:html', function () {
  return gulp.src([paths.jadeSrc, paths.ignore])
    .pipe(jade())
    .pipe(replaceExtension('.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:other', function () {
  return gulp.src([
    paths.src + 'CNAME',
    paths.src + '**/*.png',
    paths.src + '**/*.jpg',
    paths.src + '**/*.webm',
    paths.src + '**/*.gif',
    paths.src + '*.js'
  ])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:styles', function () {
  return gulp.src(paths.sassSrc)
    .pipe(sass())
    .pipe(replaceExtension('.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['build:html', 'build:other', 'build:styles']);

gulp.task('watch', ['build'], function () {
  gulp.watch(paths.allSrc, ['build']);
});

gulp.task('deploy', ['build'], function () {
  return gulp.src(paths.allDist)
    .pipe(deploy());
});
