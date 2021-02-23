const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

const htmlmin = require("gulp-htmlmin");

const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

const imagemin = require("gulp-imagemin");

const del = require("del");

const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

// Source and build directories
const paths = {
  source: "./src",
  build: "./dist",
};


function javascriptBuildMain() {
  let fileName = 'main.js'

  return (
    browserify({
      entries: [`${paths.source}/js/${fileName}`],
      transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
    })
      .bundle()
      .pipe(source(`js/${fileName}`))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest(`${paths.build}`))
  );
}

function javascriptBuildSecondary() {
  let fileName = 'anotherJsFile.js'
  
  return (
    browserify({
      entries: [`${paths.source}/js/${fileName}`],
      transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
    })
      .bundle()
      .pipe(source(`js/${fileName}`))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest(`${paths.build}`))
  );
}

/**
 * En cas de que emprem més fitxers 
 */

// Write our html task in a saperate function
function htmlBuild() {
  return gulp
    .src(`${paths.source}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.build));
}

// Processa el CSS
function cssBuild() {
  return gulp
    .src(`${paths.source}/**/css/*.css`)
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(`${paths.build}`));
}

// Comprimeix les imatges
function imgSquash() {
  return gulp
    .src(`${paths.source}/assets/images/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${paths.build}/assets/images`));
}

// Trasllada les fonts de directori
function fontsToDist() {
  return gulp.src(`${paths.source}/assets/fonts/*`).pipe(gulp.dest(`${paths.build}/assets/fonts`));
}

function cleanup() {
  // Simply execute del with the build folder path
  return del([paths.build]);
}

//compile scss into css
function style() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
}

// We have to change our exposed task, these functions can be ran in parallel as they do not depend on eachother.
// If your functions should run synchronously use gulp.series()

function watch() {
  browserSync.init({
    server: {
      baseDir: "./src",
      index: "/index.html",
    },
  });
  gulp.watch("src/scss/*.scss", style);
  gulp.watch("src/*.html").on("change", browserSync.reload);
  gulp.watch("src/js/**/*.js").on("change", browserSync.reload);
  //gulp.watch("src/images/raw*", imgSquash);
}

// We have to run the cleanup task first, after which we can run the build tasks
exports.build = gulp.series(
  cleanup,
  htmlBuild,
  imgSquash,
  fontsToDist,
  gulp.parallel(javascriptBuildMain, javascriptBuildSecondary, cssBuild, imgSquash)
);

exports.watch = watch;
