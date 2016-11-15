var gulp        = require("gulp");
var serve       = require("gulp-serve");
var sass        = require("gulp-sass");
var cssnano     = require("gulp-cssnano");
var concat      = require("gulp-concat");
var pug         = require("gulp-pug");
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");
var autoprefixer= require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var browserify  = require("browserify");
var argv        = require("yargs").argv;
var chalk       = require("chalk");

var ROOTPATH = "/";
var SERVER   = "http://localhost:8000";
var PREFIX_PATH = {
  src: 'src',
  dist: 'dist'
};
var PATH = {
  css    : {
    entry: PREFIX_PATH.src + "/views/demo.css",
    dist:  PREFIX_PATH.dist + "/assets/css"
  },
  sass   : {
    entry: PREFIX_PATH.src + "/scss/app.scss",
    src:   PREFIX_PATH.src + "/scss/**/*.scss",
    dist:  PREFIX_PATH.dist + "/assets/css"
  },
  view   : {
    entry: PREFIX_PATH.src + "/views/index.pug",
    src:   PREFIX_PATH.src + "/views/**/*.pug",
    dist:  PREFIX_PATH.dist
  },
  js     : {
    entry: PREFIX_PATH.src + "/js/app.js",
    src:   PREFIX_PATH.src + "/js/**/*.js",
    dist:  PREFIX_PATH.dist + "/assets/js"
  },
  static: {
    src: [PREFIX_PATH.src + "/**/*.{ttf,woff,woff2,eot,svg}",
          PREFIX_PATH.src + "/manifest.json",
          PREFIX_PATH.src + "/js/background.js"],
    dist: PREFIX_PATH.dist
  },
  images: {
    src: PREFIX_PATH.src + "/img/**/*.{png,jpg}",
    dist: PREFIX_PATH.dist + "/assets/img"
  }
};

// Static server + watching asset files
gulp.task('serve', ['sass', 'browserify', 'pug', 'static', 'images'], function() {
  var sync = argv.browserify ? argv.browserify : 'false';
  if (sync === 'true') {
    browserSync.init({
      proxy: SERVER
    });
    gulp.watch(PATH.sass.src, ['sass']);
    gulp.watch(PATH.js.src, ['js-watch']);
    gulp.watch(PATH.view.src, ['pug-watch']);
    gulp.watch(PATH.static.src, ['static-watch']);
    gulp.watch(PATH.static.src, ['images']);
  } else {
    gulp.watch(PATH.sass.src, ['sass']);
    gulp.watch(PATH.js.src, ['browserify']);
    gulp.watch(PATH.view.src, ['pug']);
    gulp.watch(PATH.static.src, ['static']);
    gulp.watch(PATH.static.src, ['images']);
  }
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(PATH.sass.src)
    .pipe(sass({
      includePaths: ['bower_components/ayu/src', 'bower_components/gridle/sass', 'bower_components/Ionicons/scss']
    }))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(PATH.sass.dist))
    .pipe(browserSync.stream());
});

// Compile all js files into one file
gulp.task('browserify', function() {
  return browserify(PATH.js.entry)
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(PATH.js.dist));
});

gulp.task('js-watch', ['browserify'], function(done) {
  browserSync.reload();
  done();
});

// Compile all pug files into one file
gulp.task('pug', function() {
  return gulp.src(PATH.view.entry)
    .pipe(pug())
    .pipe(gulp.dest(PATH.view.dist));
});

gulp.task('pug-watch', ['pug'], function(done) {
  browserSync.reload();
  done();
});

// Minify and clone demo css
gulp.task('democss', function() {
  return gulp.src(PATH.css.entry)
    .pipe(cssnano())
    .pipe(gulp.dest(PATH.css.dist))
    .pipe(browserSync.stream());
});

// Move all static files to dist
gulp.task('static', function() {
  return gulp.src(PATH.static.src)
    .pipe(gulp.dest(PATH.static.dist));
});

// Move all static files to dist
gulp.task('images', function() {
  return gulp.src(PATH.images.src)
    .pipe(gulp.dest(PATH.images.dist));
});

gulp.task('static-watch', ['static'], function(done) {
  browserSync.reload();
  done();
});

// Create static website server
// need to be executed separately from main task
gulp.task('server', serve({
    root: ['dist'],
    port: 8000
}));

// Export assets to other directory
// accept three argument:
// path = main directory target's path (required),
// sass = sass folder (optional),
// js = js folder (optional)
gulp.task('export-assets', function(done) {
  var sassPath = argv.sass ? argv.sass : '/assets/sass';
  var jsPath = argv.js ? argv.js : '/assets/js';

  if (argv.path === undefined) {
    console.log(chalk.red('Please provide path parameter by using --path flag'));
  } else {
    console.log('Target path: ' + chalk.cyan(argv.path));
    gulp.src(PATH.sass.src)
      .pipe(gulp.dest(argv.path + sassPath))
      .on('end', function() { console.log('Copying sass files: ' + chalk.cyan('Done')); });
    gulp.src(PATH.js.src)
      .pipe(gulp.dest(argv.path + jsPath))
      .on('end', function() { console.log('Copying js files: ' + chalk.cyan('Done')); });
  }

  return done();
});

// Main task
gulp.task('default', ['serve']);
