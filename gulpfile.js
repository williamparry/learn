var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var htmlEncode = require('htmlencode').htmlEncode;
var fileinclude = require('gulp-file-include');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var cache = require('gulp-cached');

var distBase = "app";

var dist = {
	html: distBase + '/',
	htmlFiles: distBase + "/*.html",
	examples: distBase + '/examples',
	exampleFiles: distBase + '/examples/**/*.html',
	img: distBase + '/img',
	imgFiles: distBase + "/img/*",
	css: distBase + '/css',
	cssFiles: distBase + "/css/*"
}

var sourceBase = "ui";
var source = {
	pages: sourceBase + "/*.html",
	examples: sourceBase + "/examples/**/*",
	img: sourceBase + "/img/**/*",
	scss: sourceBase + "/scss/**/*"
}

var distVals = Object.keys(dist).map(function(key) { return dist[key]; });

gulp.task('del', function(cb) {

	del.sync(distVals, { force: true });

	cb();

});

gulp.task('default', ["del", "html", "scss", "img", "examples"], function() {

	browserSync({
        server: {
        	baseDir: distBase
        },
		files: distVals,
        open: false,
		notify: false,
		reloadOnRestart: true
    });

	gulp.watch(source.pages, ["html"]);
	gulp.watch(source.examples, ["examples"]);
	gulp.watch(source.img, ["img"]);
	gulp.watch(source.scss, ["scss"]);


});

// Windows has issues with deleting, so we have to do it piecemeal
// https://github.com/gulpjs/gulp/issues/738

gulp.task('html', function(callback) {

	return gulp.src(source.pages)
		.pipe(cache('html'))
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file',
			filters: {
				htmlEncode: htmlEncode
			}
		}))
		.pipe(replace(/\<snippet>(.*?)\<\/snippet>/g, function(x, y) {
			return htmlEncode(y);
		}))
		.pipe(replace(/\.\.\/[0-9]+\//g, ''))
		.pipe(gulp.dest(dist.html));

});

gulp.task('img', function(callback) {
   return gulp.src(source.img)
   	.pipe(cache('img'))
   	.pipe(rename(function(path) {
   		// From snipping tool. Should update the source, but that's a pain in Windows land
   		path.extname = path.extname.toLowerCase();
   	}))
   	.pipe(gulp.dest(dist.img));
});

gulp.task('examples', function(callback){
   return gulp.src(source.examples)
	.pipe(cache('examples'))
	.pipe(gulp.dest(dist.examples));
});

gulp.task('scss', function(callback){
   return gulp.src(source.scss)
   	.pipe(cache('scss'))
   	.pipe(sourcemaps.init())
   	.pipe(sass())
   	.pipe(sourcemaps.write())
   	.pipe(gulp.dest(dist.css));
});