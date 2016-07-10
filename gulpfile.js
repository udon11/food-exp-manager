"use strict";

var gulp = require('gulp');
var duration = require('gulp-duration');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var glob = require('glob');

// file and dir path of browserify
var path = {
  OUTPUT_FILENAME: 'dest.js',
  DEST_BUILD: 'public/javascripts',
  ENTRY_POINT: glob.sync('./js/*.jsx')
};

// options of browserify
var props = {
  entries: path.ENTRY_POINT,
  transform: [babelify],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true,
}
var bundler = watchify(browserify(props));
bundler.on('update', compile);

// gulp tasks
gulp.task('watchify', compile);
gulp.task('default', ['watchify']);

/**
 * compile
 */
function compile(){
  return bundler.bundle()
    .on('error', function(err) {
      console.log(gutil.colors.red("Oops! you have ERROR! \n" + err.message));
      this.emit('end');
    })
    .pipe(source(path.OUTPUT_FILENAME))
    .pipe(duration( 'compiled "' + path.OUTPUT_FILENAME + '"' ))
    .pipe(gulp.dest(path.DEST_BUILD));
}
