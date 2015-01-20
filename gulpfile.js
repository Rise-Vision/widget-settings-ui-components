(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var connect = require("gulp-connect");
  var html2string = require("gulp-html2string");
  var html2js = require("gulp-html2js");
  var path = require("path");
  var rename = require("gulp-rename");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var sass = require("gulp-sass");
  var minifyCSS = require("gulp-minify-css");
  var fs = require("fs");
  var runSequence = require("run-sequence");
  var es = require("event-stream");
  var jshint = require("gulp-jshint");
  var uglify = require("gulp-uglify");
  var factory = require("widget-tester").gulpTaskFactory;
  var bower = require("gulp-bower");
  var del = require("del");

  var subcomponents = fs.readdirSync("src")
    .filter(function(file) {
      return file[0] !== "_" && //exclude folders prefixed with "_"
        fs.statSync(path.join("src", file)).isDirectory();
    });

  var views = fs.readdirSync("src/_angular")
    .filter(function(file) {
      return fs.statSync(path.join("src/_angular", file)).isDirectory();
    });

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

  // Defined method of updating:
  // Semantic
  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("sass-concat-subcomponents", function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src(path.join("src", folder, "**/*.scss"))
        .pipe(concat(folder + ".scss"))
        .pipe(gulp.dest("tmp/scss/"));
    });
   return es.concat.apply(null, tasks);
  });

  gulp.task("sass-concat-angular", function () {
    var tasks = views.map(function(folder) {
      return gulp.src(path.join("src/_angular", folder, "**/*.scss"))
        .pipe(concat(folder + ".scss"))
        .pipe(gulp.dest("tmp/scss/"));
    });
   return es.concat.apply(null, tasks);
  });

  gulp.task("sass-subcomponents", ["sass-concat-subcomponents", "sass-concat-angular"], function () {
    return gulp.src("tmp/scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("dist/css/"));
  });

  gulp.task("css-concat", ["sass-subcomponents"], function () {
    return gulp.src("dist/css/*.css")
      .pipe(concat("widget-settings-ui-components.css"))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("css-min", ["css-concat"], function () {
    return gulp.src("dist/css/*.css")
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("dist/css"));
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

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["js-uglify", "css-min"], cb);
  });

  gulp.task("webdriver_update", factory.webdriveUpdate());

  gulp.task("e2e:server", ["config"], factory.testServer());
  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("e2e:test", factory.testE2E());
  gulp.task("e2e:test-ng", ["webdriver_update"], factory.testE2EAngular({
    src: ["test/e2e/angular/*test-ng.js"]
  }));

  gulp.task("test:metrics", factory.metrics());

  gulp.task("test", function(cb) {
    runSequence("build", "e2e:server", "e2e:test", "e2e:test-ng", "e2e:server-close", "test:metrics", cb);
  });

  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("default", ["build"]);

})();
