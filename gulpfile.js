'use strict';

var _ = require('lodash');
var awsLambda = require('node-aws-lambda');
var babel = require('gulp-babel');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');

// Adapted from http://stackoverflow.com/a/23398200/454997
function stringSrc(filename, string) {
  var src = new (require('stream').Readable)({ objectMode: true });
  src._read = function () {
    this.push(new gutil.File({ cwd: '', base: '', path: filename, contents: new Buffer(string) }))
    this.push(null);
  }
  return src;
}

gulp.task('clean', function() {
  return del(['dist/', 'dist.zip']);
});

gulp.task('build', ['build:js', 'build:modules', 'build:env']);

gulp.task('build:js', function() {
  return gulp.src('src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:modules', function() {
  return gulp.src('package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({ production: true }));
});

gulp.task('build:env', function() {
  var exportedEnv = _.pick(process.env, require('./env-config.js'));
  var data = JSON.stringify(exportedEnv);
  return stringSrc('env.json', data).pipe(gulp.dest('./dist'));
});

gulp.task('zip', function() {
  return gulp.src(['dist/**/*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('upload', function(callback) {
  return awsLambda.deploy('./dist.zip', require('./lambda-config.js'), callback);
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['build'],
    ['zip'],
    ['upload'],
    callback
  );
});
