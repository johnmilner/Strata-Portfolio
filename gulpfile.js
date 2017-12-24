var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var pkg = require('./package.json');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
  return gulp.src('assets/sass/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream({once: true}));
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src('assets/css/main.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream({once: true}));
});

// Minify custom JS
gulp.task('minify-js', function() {
  return gulp.src('assets/js/main.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream({once: true}));
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
// gulp.task('copy', function() {
//   gulp.src([
//       'node_modules/bootstrap/dist/**/*',
//       '!**/npm.js',
//       '!**/bootstrap-theme.*',
//       '!**/*.map'
//     ])
//     .pipe(gulp.dest('vendor/bootstrap'))

//   gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
//     .pipe(gulp.dest('vendor/jquery'))

//   gulp.src(['node_modules/jquery.easing/*.js'])
//     .pipe(gulp.dest('vendor/jquery-easing'))

//   gulp.src([
//       'node_modules/font-awesome/**',
//       '!node_modules/font-awesome/**/*.map',
//       '!node_modules/font-awesome/.npmignore',
//       '!node_modules/font-awesome/*.txt',
//       '!node_modules/font-awesome/*.md',
//       '!node_modules/font-awesome/*.json'
//     ])
//     .pipe(gulp.dest('vendor/font-awesome'))
// })

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: ''
    },
  });
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
  gulp.watch('assets/sass/*.scss', ['sass']);
  gulp.watch('assets/css/*.css', ['minify-css']);
  gulp.watch('assets/js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('assets/js/**/*.js', browserSync.reload);
});
