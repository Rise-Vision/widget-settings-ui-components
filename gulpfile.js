(function () {
  "use strict";

  var gulp = require("gulp");
  var spawn = require("spawn-cmd").spawn;
  var gutil = require("gulp-util");
  var connect = require("gulp-connect");
  var html2string = require("gulp-html2string");
  var path = require("path");
  var rename = require("gulp-rename");
  var clean = require("gulp-clean");
  var concat = require("gulp-concat");
  var bump = require('gulp-bump');
  var sass = require('gulp-sass');
  var minifyCSS = require('gulp-minify-css');
  var fs = require("fs");
  var runSequence = require('gulp-run-sequence');
  var es = require('event-stream');
  var path = require("path");
  var uglify = require('gulp-uglify');
  var httpServer;
  var subcomponents = fs.readdirSync('src')
    .filter(function(file) {
      return file[0] !== '_' && //exclude folders prefixed with "_"
        fs.statSync(path.join('src', file)).isDirectory();
    });
  var views = fs.readdirSync('src/_angular')
    .filter(function(file) {
      return fs.statSync(path.join('src/_angular', file)).isDirectory();
    });

  var sassFiles = [
      "src/scss/**/*.scss"
    ],

    cssFiles = [
      "src/css/**/*.css"
    ];

  gulp.task('clean-dist', function () {
    return gulp.src('dist', {read: false})
      .pipe(clean());
  });

  gulp.task('clean-tmp', function () {
    return gulp.src('tmp', {read: false})
      .pipe(clean());
  });

  gulp.task('clean', ['clean-dist', 'clean-tmp']);

  gulp.task('config', function() {
    var env = process.env.NODE_ENV || 'dev';
    gutil.log('Environment is', env);

    return gulp.src(['./src/_config/' + env + '.js'])
      .pipe(rename('config.js'))
      .pipe(gulp.dest('./src/_config'));
  });

  // Defined method of updating:
  // Semantic
  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("e2e:server", ["build"], function() {
    httpServer = connect.server({
      root: "./",
      port: 8099,
      livereload: false
    });
    return httpServer;
  });

  gulp.task('sass-concat-subcomponents', function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src(path.join('src', folder, '**/*.scss'))
        .pipe(concat(folder + ".scss"))
        .pipe(gulp.dest("tmp/scss/"));
    });
   return es.concat.apply(null, tasks);
  });

  gulp.task("sass-subcomponents", ['sass-concat-subcomponents'], function () {
    return gulp.src('tmp/scss/*.scss')
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

  gulp.task('html2js-subcomponents', function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src(path.join('src', folder, '**/*.html'))
        .pipe(html2string({ createObj: true, base: path.join(__dirname, 'src', folder), objName: 'TEMPLATES' }))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest(path.join('tmp', 'templates', folder)));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task('js-concat-subcomponents', ["html2js-subcomponents"], function () {
    var tasks = subcomponents.map(function(folder) {
      return gulp.src([
        path.join('src', folder, '**/*.js'),
        path.join('tmp', "templates", folder, "**/*.js"), //template js files
        'src/_config/config.js'
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

  gulp.task('html2js-views', function () {
    var tasks = views.map(function(folder) {
      return gulp.src(path.join('src/_angular', folder, '**/*.html'))
        .pipe(html2string({ createObj: true, base: path.join(__dirname, 'src/_angular'), objName: 'VIEWS' }))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest(path.join('tmp', 'views', folder)));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("angular", ['html2js-views'], function () { //copy angular files
    var tasks = views.map(function(folder) {
      return gulp.src([
        path.join('src/_angular', folder, '**/*.js'),
        path.join('tmp/views/', folder, '**/*.js')
      ])
      .pipe(concat(folder + '.js'))
      .pipe(gulp.dest("dist/js/angular"));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("js-uglify", ["angular", "js-concat"], function () {
    gulp.src('dist/js/**/*.js')
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("e2e:test", ["build", "e2e:server"], function () {
      var tests = ["test/e2e/alignment-scenarios.js", "test/e2e/url-field-scenarios.js"];

      var casperChild = spawn("casperjs", ["test"].concat(tests));

      casperChild.stdout.on("data", function (data) {
          gutil.log("CasperJS:", data.toString().slice(0, -1)); // Remove \n
      });

      casperChild.on("close", function (code) {
          var success = code === 0; // Will be 1 in the event of failure
          connect.serverClose();
          // Do something with success here
      });
  });

  gulp.task("e2e:test-ng", ["webdriver_update", "e2e:server"], function () {
    return gulp.src(["./test/e2e/test-ng.js"])
      .pipe(protractor({
          configFile: "./test/protractor.conf.js",
          args: ["--baseUrl", "http://127.0.0.1:" + e2ePort + "/test/e2e/test-ng.html"]
      }))
      .on("error", function (e) { console.log(e); throw e; })
      .on("end", function () {
        connect.serverClose();
      });
  });


  gulp.task('build', function (cb) {
      runSequence(['clean', 'config'], ['js-uglify', 'css-min'], cb);
  });

  gulp.task("test", ["e2e:test"]);

  gulp.task("default", ["build"]);

})();
