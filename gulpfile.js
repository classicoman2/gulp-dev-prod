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

// To prevent rewriting the source and build folder locations
const paths = {
  source: "./src",
  build: "./dist",
};

function javascriptBuild() {
  return (
    browserify({
      entries: [`${paths.source}/js/main.js`],
      transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
    })
      .bundle()
      .pipe(source("js/main.js"))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest(`${paths.build}`))
  );
}

// Write our html task in a seperate function
function htmlBuild() {
  return gulp
    .src(`${paths.source}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.build));
}

function cssBuild() {
  return gulp
    .src(`${paths.source}/**/css/*.css`)
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(`${paths.build}`));
}

//xtoni - set paths

function imgSquash() {
  return gulp.src(`${paths.source}/assets/images/*`)
  .pipe(imagemin())
  .pipe(gulp.dest(`${paths.build}/assets/images`));
}

function fontsToDist() {
  return gulp.src(`${paths.source}/assets/fonts/*`)
  .pipe(gulp.dest((`${paths.build}/assets/fonts/*`)) )
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
  gulp.watch("src/scss/**/*.scss", style);
  gulp.watch("src/*.html").on("change", browserSync.reload);
  gulp.watch("src/js/**/*.js").on("change", browserSync.reload);
  //gulp.watch("src/images/raw*", imgSquash);
}

// We have to run the cleanup task first, after which we can run the build tasks
exports.build = gulp.series(cleanup, htmlBuild, imgSquash, fontsToDist, gulp.parallel(javascriptBuild, cssBuild, imgSquash));

exports.watch = watch;
