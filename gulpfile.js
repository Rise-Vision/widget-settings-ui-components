(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var html2string = require("gulp-html2string");
  var html2js = require("gulp-html2js");
  var path = require("path");
  var rename = require("gulp-rename");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var fs = require("fs");
  var runSequence = require("run-sequence");
  var es = require("event-stream");
  var jshint = require("gulp-jshint");
  var uglify = require("gulp-uglify");
  var factory = require("widget-tester").gulpTaskFactory;
  var bower = require("gulp-bower");
  var del = require("del");
  var colors = require("colors");
  var deploy      = require('gulp-gh-pages');
  var argv        = require('minimist')(process.argv.slice(2));

  var subcomponents = fs.readdirSync("src")
    .filter(function(file) {
      return file[0] !== "_" && //exclude folders prefixed with "_"
        fs.statSync(path.join("src", file)).isDirectory();
    });

  var views = fs.readdirSync("src/_angular")
    .filter(function(file) {
      return fs.statSync(path.join("src/_angular", file)).isDirectory();
    });

  var dependencies = [
    "components/tinymce-dist/tinymce.min.js",
    "components/angular-ui-tinymce/src/tinymce.js",
    "components/angular-load/angular-load.min.js"
  ];

  gulp.task("clean-bower", function(cb){
    del(["./components/**"], cb);
  });

  gulp.task("clean-dist", function (cb) {
    del(['./dist/**'], cb);
  });

  gulp.task("clean-tmp", function (cb) {
    del(['./tmp/**'], cb);
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/_config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/_config"));
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("html2js-subcomponents", function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src(path.join("src", folder, "**/*.html"))
        .pipe(html2string({ createObj: true, base: path.join(__dirname, "src", folder), objName: "TEMPLATES" }))
        .pipe(rename({extname: ".js"}))
        .pipe(gulp.dest(path.join("tmp", "templates", folder)));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("lint", function() {
    return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("dependencies", function () {
    return gulp.src(dependencies)
      .pipe(gulp.dest("dist/js/vendor"));
  });

  gulp.task('js-concat-subcomponents', ["html2js-subcomponents", "lint"], function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src([
        path.join("tmp", "templates", folder, "**/*.js"), //template js files
        path.join("src", folder, "**/*.js"),
        "src/_config/config.js"
        ])
        .pipe(concat(folder + ".js"))
        .pipe(gulp.dest("dist/js"));
    });
   return es.concat.apply(null, tasks);
  });

  gulp.task("js-concat", ["js-concat-subcomponents"], function () {
    return gulp.src("dist/js/*.js")
      .pipe(concat("widget-settings-ui-components.js"))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("html2js-angular", function() {
    var tasks = views.map(function(folder) {
      return gulp.src(path.join("src/_angular", folder, "**/*.html"))
        .pipe(html2js({
        outputModuleName: "risevision.widget.common." + folder,
        useStrict: true,
        base: "src"
      }))
      .pipe(rename({extname: ".js"}))
      .pipe(gulp.dest(path.join("tmp/ng-templates/", folder)));
    });
      return es.concat.apply(null, tasks);
  });

  gulp.task("angular", ["html2js-angular"], function () { //copy angular files
    var tasks = views.map(function(folder) {
      return gulp.src([
        path.join("src/_angular", folder, "**/*.js"),
        path.join("tmp/ng-templates/", folder, "**/*.js")
      ])
      .pipe(concat(folder + ".js"))
      .pipe(gulp.dest("dist/js/angular"));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("js-uglify", ["angular", "js-concat"], function () {
    gulp.src("dist/js/**/*.js")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("webdriver_update", factory.webdriveUpdate());

  // ***** e2e Testing ***** //

  gulp.task("e2e:server", ["config"], factory.testServer());
  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("e2e:test", factory.testE2E());
  gulp.task("e2e:test-ng", ["webdriver_update"], factory.testE2EAngular({
    src: ["test/e2e/angular/*test-ng.js"]
  }));

  // ***** Primary Tasks ***** //
  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  // ****** Unit Testing ***** //
  gulp.task("test:unit", factory.testUnitAngular(
    {testFiles: [
      "components/angular/angular.js",
      "components/angular-mocks/angular-mocks.js",
      "components/angular-sanitize/angular-sanitize.js",
      "components/angular-bootstrap/ui-bootstrap-tpls.js",
      "components/jquery/dist/jquery.js",
      "components/angular-translate/angular-translate.js",
      "components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "components/rv-common-i18n/dist/i18n.js",
      "node_modules/widget-tester/mocks/i18n-config.js",
      "components/component-storage-selector/dist/storage-selector.js",
      "components/component-subscription-status/dist/js/subscription-status.js",
      "dist/js/angular/tooltip.js",
      "dist/js/angular/url-field.js",
      "dist/js/angular/file-selector.js",
      "test/mock/subscription-svc-http-mock.js",
      "test/unit/**/*spec.js"]}
  ));

  gulp.task("test", function(cb) {
    runSequence("build", "test:unit", "e2e:server", "e2e:test", "e2e:test-ng", "e2e:server-close", cb);
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["js-uglify"], ["dependencies"], cb);
  });

  gulp.task("demo:server", ["build-demo"], factory.testServer({
    rootPath: "./dist-demos"
  }));

  gulp.task("build-demo", function (cb) {
    runSequence("copy-pages-to-demo-dist", "copy-dist-to-demo-dist", "copy-components-to-demo-dist", "copy-mocks-to-demo-dist", cb);
  });

  gulp.task("copy-pages-to-demo-dist", function() {
    return gulp.src(["./demos/*.html"])
      .pipe(gulp.dest("./dist-demos"));
  });

  gulp.task("copy-dist-to-demo-dist", function() {
    return gulp.src(["./dist/**"])
      .pipe(gulp.dest("./dist-demos/dist"));
  });

  gulp.task("copy-components-to-demo-dist", function() {
    return gulp.src(["./components/**"])
      .pipe(gulp.dest("./dist-demos/components"));
  });

  gulp.task("copy-mocks-to-demo-dist", function() {
    return gulp.src(["./demos/mocks/**"])
      .pipe(gulp.dest("./dist-demos/mocks"));
  });

  /**
   *  Deploy to gh-pages
   */
  gulp.task("deploy-demo", function () {

    // Remove temp folder created by gulp-gh-pages
    if (argv.clean) {
      var os = require('os');
      var path = require('path');
      var repoPath = path.join(os.tmpdir(), 'tmpRepo');
      gutil.log('Delete ' + gutil.colors.magenta(repoPath));
      del.sync(repoPath, {force: true});
    }

    return gulp.src("./dist-demos/**/*")
      .pipe(deploy("https://github.com/Rise-Vision/widget-settings-ui-components.git"));
  });

  gulp.task("default", [], function() {
    console.log("********************************************************************".yellow);
    console.log("  gulp bower-clean-install: delete and re-install bower components".yellow);
    console.log("  gulp test: run e2e tests".yellow);
    console.log("  gulp build: build distribution versions of all components".yellow);
    console.log("********************************************************************".yellow);
    return true;
  });

})();
