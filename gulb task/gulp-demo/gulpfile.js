const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp");

var GLOBS = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  img: "project/pics/*",
  js: "project/js/**/*.js",
};

const imagemin = require("gulp-imagemin");

function imgMinify() {
  return gulp.src(GLOBS.img).pipe(imagemin()).pipe(gulp.dest("dist/images"));
}

exports.img = imgMinify;

const htmlmin = require("gulp-htmlmin");
function minifyHTML() {
  return src(GLOBS.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
}

exports.html = minifyHTML;

const concat = require("gulp-concat");
const terser = require("gulp-terser");

function jsminiy() {
  return src(GLOBS.js, { sourcemaps: true })
    .pipe(concat("all.min.js"))

    .pipe(terser())

    .pipe(dest("dist/assets/js", { sourcemaps: "." }));
}
exports.js = jsminiy;

var cleanCss = require("gulp-clean-css");
function cssMinify() {
  return src(GLOBS.css)
    .pipe(concat("style.min.css"))

    .pipe(cleanCss())
    .pipe(dest("dist/assets/css"));
}
exports.css = cssMinify;

var browserSync = require("browser-sync");
function serve(cb) {
  browserSync({
    server: {
      baseDir: "dist/",
    },
  });
  cb();
}

function reloadTask(done) {
  browserSync.reload();
  done();
}

function watchTask() {
  watch(GLOBS.html, series(minifyHTML, reloadTask));
  watch(GLOBS.js, series(jsminiy, reloadTask));
  watch(GLOBS.css, series(cssMinify, reloadTask));
  watch(GLOBS.img, series(imgMinify, reloadTask));
}
exports.default = series(
  parallel(imgMinify, jsminiy, cssMinify, minifyHTML),
  serve,
  watchTask
);
