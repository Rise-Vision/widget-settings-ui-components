/* jshint node: true */

(function () {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var connect = require('gulp-connect');
  var rename = require('gulp-rename');
  var concat = require('gulp-concat');
  var bump = require('gulp-bump');
  var watch = require('gulp-watch');
  var path = require('path');
  var jshint = require('gulp-jshint');
  var runSequence = require('run-sequence');
  var factory = require("widget-tester").gulpTaskFactory;

  var appJSFiles = [
      'src/js/**/*.js',
      'test/**/*.js'
    ];

  gulp.task('config', function() {
    var env = process.env.NODE_ENV || 'dev';
    gutil.log('Environment is', env);

    return gulp.src(['./src/js/config/' + env + '.js'])
      .pipe(rename('config.js'))
      .pipe(gulp.dest('./src/js/config'));
  });

  // Defined method of updating:
  // Semantic
  gulp.task('bump', function(){
    return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
  });

  gulp.task('lint', function() {
    return gulp.src(appJSFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', function(err) {
        throw err;
      });
  });

  gulp.task('concat', ['config'], function () {
    gulp.src(['./src/js/config/config.js', './src/js/*.js'])
    .pipe(concat(require(path.join(__dirname, 'package.json')).name + '.js'))
    .pipe(gulp.dest('./dist/'));
  });

  gulp.task('build', ['lint', 'concat']);

  gulp.task("e2e:server", ["config"], factory.testServer());
  gulp.task("test:e2e", ["e2e:server"], factory.testE2E());

  gulp.task("test:unit:ng", factory.testUnitAngular(
    {testFiles: [
          'components/jquery/dist/jquery.js',
          'components/q/q.js',
          'components/angular/angular.js',
          'components/angular-mocks/angular-mocks.js',
          'src/js/*.js',
          'src/js/*/*.js',
          'src/js/**/*.js',
          'src/js/**/**/*.js',
          'test/unit/fixtures/*.js',
          'test/unit/**/*spec.js']}
  ));

  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("test:e2e:settings", ["webdriver_update", "e2e:server"], factory.testE2EAngular());
  gulp.task("test:metrics", factory.metrics());

  gulp.task("test", function(cb) {
    runSequence("test:unit:ng", "test:e2e:settings", "e2e:server-close", "test:metrics", cb);
  });

  gulp.task('default', ['build']);

})();
