(function () {
  "use strict";

  var gulp = require("gulp");
  var bump = require("gulp-bump");
  var concat = require("gulp-concat");
  var folders = require("gulp-folders");
  var html2js = require("gulp-html2js");
  var jshint = require("gulp-jshint");
  var gutil = require("gulp-util");
  var rename = require("gulp-rename");
  var uglify = require("gulp-uglify");
  var path = require("path");
  var runSequence = require("run-sequence");
  var factory = require("widget-tester").gulpTaskFactory;
  var del = require("del");
  var colors = require("colors");
  var minifyCSS = require("gulp-minify-css");
  var bower = require("gulp-bower");
  var wct = require("web-component-tester").gulp.init(gulp);

  gulp.task("clean", function (cb) {
    del(["./dist/**"], cb);
  });

  gulp.task("clean-bower", function(cb){
    del(["./components/**"], cb);
  });

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "prod";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"))
      .pipe(gulp.dest("dist"));
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src("src/**/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
      //.pipe(jshint.reporter("fail"));
  });

  gulp.task("css", function() {
    return gulp.src("src/css/**/*.css")
    .pipe(gulp.dest("dist/css"))
  });

  gulp.task("css-concat", ["css"], function () {
    return gulp.src("dist/**/*.css")
      .pipe(concat("all.css"))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("css-minify", ["css-concat"], function () {
    gulp.src("dist/css/*.css")
      .pipe(minifyCSS())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("js", function (cb) {
    return gulp.src("src/js/*.js")
      .pipe(gulp.dest("dist"));
  });

  gulp.task("js-folder", folders("src/js", function(folder) {
    return gulp.src(path.join("src/js", folder, "*.js"))
      .pipe(concat(folder + ".js"))
      .pipe(gulp.dest("dist"));
  }));

  gulp.task("js-concat", ["js", "js-folder"], function (cb) {
    return gulp.src("dist/**/*.js")
      .pipe(concat("all.js"))
      .pipe(gulp.dest("dist"));
  });

  gulp.task("js-uglify", ["js-concat"], function () {
    gulp.src("dist/*.js")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist"));
  });

  gulp.task("assets", function () {
    gulp.src("src/assets/**/*")
      .pipe(gulp.dest("dist/assets"))
  });

  // ***** e2e Testing ***** //
  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("e2e:server", ["config"], factory.testServer());

  gulp.task("e2e:run", factory.testE2E());

  gulp.task("test:e2e", function(cb) {
    runSequence(["e2e:server"], "e2e:run", "e2e:server-close", cb);
  });

  // ****** Unit Testing ***** //
  gulp.task("test:unit", factory.testUnitAngular(
    {testFiles: [
      "components/jquery/dist/jquery.min.js",
      "test/date.js",
      "test/data/financial.js",
      "node_modules/widget-tester/mocks/gadget-mocks.js",
      "node_modules/widget-tester/mocks/visualization-api-mock.js",
      "test/mocks/ajax.js",
      "src/config/test.js",
      "src/js/store-auth.js",
      "src/js/visualization.js",
      "src/js/financial/*.js",
      "src/js/background.js",
      "src/js/common.js",
      "src/js/rise-cache.js",
      "src/js/logger.js",
      "test/unit/**/*spec.js"]}
  ));

  // ***** Integration Testing ***** //
  gulp.task("test:integration", function(cb) {
    runSequence("test:local", cb);
  });

  // ***** Primary Tasks ***** //
  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("build", function (cb) {
    runSequence(["clean"], ["config"], ["lint", "js-uglify", "css-minify", "assets"], cb);
  });

  gulp.task("test", function(cb) {
    runSequence("test:unit", "test:e2e", "test:integration", cb)
  });

  gulp.task("default", [], function() {
    console.log("********************************************************************".yellow);
    console.log("  gulp bower-clean-install: delete and re-install bower components".yellow);
    console.log("  gulp test: run e2e and unit tests".yellow);
    console.log("  gulp build: build a distribution version".yellow);
    console.log("********************************************************************".yellow);
    return true;
  });

})();
