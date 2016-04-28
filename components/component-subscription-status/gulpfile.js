(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var path = require("path");
  var rename = require("gulp-rename");
  var rimraf = require("gulp-rimraf");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var sass = require("gulp-sass");
  var minifyCSS = require("gulp-minify-css");
  var runSequence = require("run-sequence");
  var jshint = require("gulp-jshint");
  var uglify = require("gulp-uglify");
  var html2js = require("gulp-html2js");
  var factory = require("widget-tester").gulpTaskFactory;

  var jsFiles = [
    "src/**/*.js",
    "test/**/*.js",
  ];

  gulp.task("clean-dist", function () {
    return gulp.src("dist", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean-tmp", function () {
    return gulp.src("tmp", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  // Defined method of updating:
  // Semantic
  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src(jsFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
    // .pipe(jshint.reporter("fail"));
  });

  gulp.task("i18n", function() {
    return gulp.src("src/locales/**/*.json")
    .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("sass", function () {
    return gulp.src("src/scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("css-min", ["sass"], function () {
    return gulp.src("dist/css/*.css")
      .pipe(minifyCSS({keepBreaks:true}))
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("html2js", function() {
    return gulp.src("src/**/*.html")
      .pipe(html2js({
        outputModuleName: "risevision.widget.common.subscription-status",
        useStrict: true,
        base: "src"
      }))
      .pipe(rename({extname: ".js"}))
      .pipe(gulp.dest("tmp/ng-templates"));
  });

  gulp.task("angular", ["html2js"], function () {
    return gulp.src([
      "src/config/config.js",
      "src/*.js",
      "tmp/ng-templates/*.js"])
      .pipe(concat("subscription-status.js"))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("js-prep", ["lint"], function (cb) {
    return runSequence("angular", cb);
  });

  gulp.task("js-uglify", ["js-prep"], function () {
    gulp.src("dist/js/**/*.js")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["js-uglify", "css-min", "i18n"], cb);
  });

  gulp.task("test:unit", factory.testUnitAngular({
    testFiles: [
      "components/q/q.js",
      "components/angular/angular.js",
      "components/angular-bootstrap/ui-bootstrap-tpls.js",
	    "components/angular-translate/angular-translate.js",
	    "components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "components/angular-mocks/angular-mocks.js",
      "components/angular-sanitize/angular-sanitize.js",
      "components/rv-common-i18n/dist/i18n.js",
      "node_modules/widget-tester/mocks/gadget-mocks.js",
      "node_modules/widget-tester/mocks/common-mock.js",
      "components/widget-settings-ui-core/dist/widget-settings-ui-core.js",
      "src/config/test.js",
      "src/*.js",
      "test/svc-http-mock.js",
      "test/unit/**/*spec.js"
    ]
  }));

  gulp.task("e2e:server", factory.testServer());
  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("test:e2e:core", factory.testE2EAngular({
    testFiles: path.join(__dirname, "test", "e2e", "*scenarios.js")
  }));
  gulp.task("metrics", factory.metrics());

  gulp.task("test:e2e", ["webdriver_update"], function (cb) {
    return runSequence("e2e:server", "test:e2e:core", "e2e:server-close", cb);
  });

  gulp.task("test", ["build"], function (cb) {
    return runSequence("test:unit", "test:e2e", "metrics", cb);
  });

  gulp.task("default", ["build"]);

})();
