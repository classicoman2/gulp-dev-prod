/**
 * Com emprar aquest fitxer:
 *  - Comprova que les rutes estan correctes en els llocs
 * marcats amb // CHECK
 */

//GULP
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

// AUTOPREFIXER
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

// Source and build directories
const paths = {
  // CHECK
  source: "./src",
  build: "./dist",
};


function javascriptBuildMain() {
  // CHECK - Posa aqui el nom del principal fitxer javascript
  
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

function javascriptBuildMain2() {
  // CHECK - Posa aqui el nom del principal fitxer javascript
  
  let fileName = 'main-2.js'

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



// Write our html task in a saperate function
function htmlBuild() {
  return gulp
  // CHECK - comprova la ruta dels fitxers HTML
    .src(`${paths.source}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.build));
}


// AUTOPREFIXER per a afegir els vendor prefixes als estils CSS que ho requereixin
function fix() {
  // Neteja la carpeta dist
  
  return gulp.src('./*.css-original')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
}



// Processa el CSS
function cssBuild() {
  return gulp  
  // CHECK - comprova la ruta dels fitxers CSS
    .src(`${paths.source}/**/css/*.css`)
    .pipe(postcss([cssnano()]))
    .pipe(postcss([ autoprefixer() ]))  //nou
    .pipe(sourcemaps.write('.'))  //nou
    .pipe(gulp.dest(`${paths.build}`));
}

// Comprimeix les imatges
function imgSquash() {
  return gulp
    // CHECK - comprova la ruta dels fitxers d'imatge
    .src(`${paths.source}/assets/images/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${paths.build}/assets/images`));
}


function cleanup() {
  // Neteja la carpeta dist
  return del([paths.build]);
}


exports.build = gulp.series(
  cleanup,
  htmlBuild,
  imgSquash,
  gulp.parallel(javascriptBuildMain, cssBuild, imgSquash),
  gulp.parallel(javascriptBuildMain2, cssBuild, imgSquash)
);
