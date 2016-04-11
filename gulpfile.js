var copyDir = ['data/', 'php/'];
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  bump = require('gulp-bump'),
  del = require('del'),
  fs = require('fs'),
  imagemin = require('gulp-imagemin'),
  jshint = require('gulp-jshint'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  semver = require('semver'),
  tokenreplace = require('gulp-token-replace'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin');

var getPackageJson = function() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  };

var pkg = getPackageJson();
var newVer = semver.inc(pkg.version, 'patch');

gulp.task('clean', function(cb) {
  del(['public/**', '!public'], cb);
});

gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('images', function() {
  return gulp.src('img/*')
    .pipe(imagemin())
		.pipe(gulp.dest('public/img'));
});

gulp.task('copy', function() {
  //append globbing values
  for (var i = 0; i < copyDir.length; i++) {
    copyDir[i] = copyDir[i] + '**/*';
  }

  //remove "cache" folders
  copyDir.push('!**/{cache,cache/**}');

  return gulp.src(copyDir, { base: '.' })
    .pipe(gulp.dest('public/'));
});

gulp.task('site-build', function() {
  return gulp.src('index.html')
    .pipe(tokenreplace({ tokens: { site: 'site-' + newVer + '.min' } }))
		.pipe(usemin({
      assetsDir: '',
      css: [autoprefixer('last 2 versions'), minifycss(), 'concat'],
      js: [uglify(), 'concat'],
		}))
		.pipe(gulp.dest('public/'));
});

gulp.task('bump', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ version: newVer }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['clean'], function() {
  // default tasks
  gulp.start('site-build', 'images', 'copy', 'move-bower-fonts', 'bump');
});

gulp.task('move-bower-fonts', function() {
  return gulp.src('bower_components/**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('public/fonts/'));
});
