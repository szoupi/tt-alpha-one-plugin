// https://github.com/CodeChron/browsersync-gulp-4-express/blob/master/gulpfile.js
//  gulp.src(['app/**/*.{gif,png,jpg}'])

var gulp = require('gulp')
var sass = require('gulp-sass')
var rename = require('gulp-rename')
// var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var cleanDest = require('gulp-clean-dest')
var responsive = require('gulp-responsive')
const webp = require('gulp-webp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps') // maps to original files
var compressor = require('node-minify')
var gzip = require('gulp-gzip')
var tinify = require('gulp-tinify')


// dist is the distribution folder
var paths = {
	// copyFilesDist: {
	// 	src: './*.html',
	// 	dest: './dist/'
	// },
	styles: {
		src: './sass/**/*.scss',
		dest: './css'
	},
	// stylesDist: {
	// 	src: './sass/**/*.scss',
	// 	dest: './dist/css'
	// },
	images: {
		src: './img-raw/**/*.{jpg,jpeg,png}',
		dest: './img'
	},
	imagesWebp: {
		src: './img/**/*.{jpg,jpeg,png}',
		dest: './img-webp'
	},
	scripts: {
		src: './js/**/*.js',
		dest: './js/'
	},
	scriptsDist: {
		src: './js/**/*.js',
		dest: './dist/js/'
	}
	// gzip: {
	// 	src: 'js/**/*.{html,xml,json,css,js}',
	// 	dest: './js/'
	// 	options: {}
	// },

}



/*
 * Define tasks using plain functions
 */
function styles() {
	return gulp
		.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		// .pipe(autoprefixer({
		// 	browsers: ['last 2 versions']
		// }))
		.pipe(sourcemaps.init({
			loadMaps: true
		})) // Strip inline source maps
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(concat('allStyles.css'))
		.pipe(sourcemaps.write())
		.pipe(cleanDest(paths.styles.dest))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function watch() {
	//watch the styles folder and execute styles func
	gulp.watch(paths.styles.src, styles).on('change', browserSync.reload)
	gulp.watch('./**/*.{html,js}').on('change', browserSync.reload)
	// gulp.watch('/index.html', copyFilesToDist).on('change', browserSync.reload)

}

function browserSyncInit() {
	browserSync.init({
		server: {
			baseDir: './'
			// baseDir: './dist/' // for production
		}
	})
}


// copy webp images to img folder
function copyWebpToImg() {
	return gulp
		.src('./img-raw/*.webp')
		.pipe(gulp.dest('./img'))
}



// MINIFY js script BUGGY babelify and uglify destroys the code...
// Usage: execute concatScripts then minifyScripts
// sourcemaps doubles the size so should not be used on production files
function minifyJS() {
	// Using Google Closure Compiler
	var mainMin = compressor.minify({
		compressor: 'gcc',
		input: 'js/main.js',
		output: 'js/main-min.js',
		callback: function (err, min) {}
	})
	var dbhelperMin = compressor.minify({
		compressor: 'gcc',
		input: 'js/dbhelper.js',
		output: 'js/dbhelper-min.js',
		callback: function (err, min) {}
	})

	var restInfoMin = compressor.minify({
		compressor: 'gcc',
		input: 'js/restaurant_info.js',
		output: 'js/restaurant_info-min.js',
		callback: function (err, min) {}
	})

	var swMin = compressor.minify({
		compressor: 'gcc',
		input: 'sw.js',
		output: 'sw-min.js',
		callback: function (err, min) {}
	})

	return mainMin, dbhelperMin, restInfoMin, swMin
}

// MAKE IMAGES RESPONSIVE
function responsiveImages() {
	return gulp
		.src(paths.images.src)
		.pipe(responsive({
			// Resize jpg in various sizes
			'*.{jpg,JPG,jpeg,JPEG}': [
				// {
				// 	width: 64,
				// 	rename: {
				// 		suffix: '-64w'
				// 	}
				// },
				{
					width: 640,
					rename: {
						suffix: '-640w'
					}
				},
				{
					width: 768,
					rename: {
						suffix: '-768w'
					}
				},
				{
					width: 1024,
					rename: {
						suffix: '-1024w'
					}
				},
				{
					width: 1366,
					rename: {
						suffix: '-1366w'
					}
				},
				{
					width: 1600,
					rename: {
						suffix: '-1600w'
					}
				},
				{
					width: 1920,
					rename: {
						suffix: '-1920w'
					}
				},							
				{ // rename original img
					rename: {
						suffix: '-orig'
					}
				}
			],
			// Resize all PNG images width only    
			// '*.png': [
			// 	{
			// 		width: 48,
			// 		rename: {
			// 			suffix: '-48w'
			// 		},
			// 	},
			// 	{
			// 		width: 96,
			// 		rename: {
			// 			suffix: '-96w'
			// 		},
			// 	},
			// 	{
			// 		width: 144,
			// 		rename: {
			// 			suffix: '-144w'
			// 		},
			// 	},
			// 	{
			// 		width: 192,
			// 		rename: {
			// 			suffix: '-192w'
			// 		},
			// 	},
			// 	{
			// 		width: 512,
			// 		rename: {
			// 			suffix: '-512w'
			// 		},
			// 	},
			// 	{
			// 		width: 250 * 2,
			// 		rename: {
			// 			suffix: '-250x250@2x'
			// 		},
			// 	},
			// 	{ 
			// 		// rename original img
			// 		rename: {
			// 			suffix: '-orig'
			// 		}					
			// 	},
			// 	// Resize all PNG images (currently the logo) to be retina ready    
			// 	{
			// 		width: 48,
			// 		height: 48,
			// 		rename: {
			// 			suffix: '-48x48'
			// 		},
			// 	},
			// 	{
			// 		width: 80,
			// 		height: 80,
			// 		rename: {
			// 			suffix: '-80x80'
			// 		},
			// 	},
			// 	{
			// 		width: 96,
			// 		height: 96,
			// 		rename: {
			// 			suffix: '-96x96'
			// 		},
			// 	},
			// 	{
			// 		width: 144,
			// 		height: 144,
			// 		rename: {
			// 			suffix: '-144x144'
			// 		},
			// 	},
			// 	{
			// 		width: 192,
			// 		height: 192,
			// 		rename: {
			// 			suffix: '-192x192'
			// 		},
			// 	},
			// 	{
			// 		width: 590,
			// 		height: 300,
			// 		rename: {
			// 			suffix: '-590x300'
			// 		},
			// 	},
			// 	{
			// 		width: 250 * 2,
			// 		rename: {
			// 			suffix: '-250x250@2x'
			// 		},
			// 	}
			// ],
		}, {
			// Global configuration for all images
			// The output quality for JPEG, WebP and TIFF output formats
			quality: 90,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			withMetadata: false,
			errorOnEnlargement: false
		}))
		.pipe(cleanDest(paths.images.dest))
		.pipe(gulp.dest(paths.images.dest))
}

// RENAME IMAGES 
function renameImages() {
	return gulp
		.src(paths.images.src)
		.pipe(responsive({
			// Resize jpg in various sizes
			'*.{jpg,JPG,png}': [
				{ // rename original img
					rename: {
						prefix: 'kiki-2020-'
					}
				}
			]
		}))
		.pipe(cleanDest(paths.images.dest))
		.pipe(gulp.dest(paths.images.dest))
}


// TODO: test
// only reduce file size
// and keep folder structure
function compressImages() {
	return gulp.src(paths.images.src)
		.pipe(responsive({
			'**/*': {
				quality: 50,
				compressionLevel: 9,
				progressive: false,
				withMetadata: false,
			},
		}))
		.pipe(cleanDest(paths.styles.dest))
		.pipe(gulp.dest('./img/'))
}


// ///////////////////////////////////
// MAKE THUMBNAILS
// MAKE IMAGES RESPONSIVE
function makethumb() {
	return gulp
		.src(paths.images.src)
		.pipe(responsive({
			'*.{png,jpg}': [
				{
					width: 48,
					height: 48,
					rename: {
						suffix: '-48x48'
					},
				},
				{
					width: 96,
					height: 96,
					rename: {
						suffix: '-96x96'
					},
				},
				{
					width: 144,
					height: 144,
					rename: {
						suffix: '-144x144'
					},
				},
				{
					width: 192,
					height: 192,
					rename: {
						suffix: '-192x192'
					},
				},
				{
					width: 512,
					height: 512,
					rename: {
						suffix: '-512x512'
					},
				},
				{
					width: 250 * 2,
					rename: {
						suffix: '-250x250@2x'
					},
				}
			],
		}, {
			// Global configuration for all images
			// The output quality for JPEG, WebP and TIFF output formats
			quality: 90,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			withMetadata: false,
			errorOnEnlargement: false
		}))
		.pipe(cleanDest(paths.images.dest))
		.pipe(gulp.dest(paths.images.dest))
}


// ///////////////////////////////////
function convertToWebp() {
	return gulp
		.src(paths.imagesWebp.src)
		.pipe(webp())
		// into src folder, aka img-raw, 
		// because is the src folder for responsiveImages()
		.pipe(gulp.dest(paths.imagesWebp.dest))
}

// concat already minimized js files
function concatJS() {
	// index.html js 
	var indexJS = gulp.src(['./js/dbhelper-min.js', './js/main-min.js'])
		.pipe(concat('allMain.min.js'))
		// .pipe(gzip())
		.pipe(gulp.dest('./js'))

	// restaurant.html js 
	var restaurantJS = gulp.src(['./js/dbhelper-min.js', './js/restaurant_info-min.js'])
		.pipe(concat('allRestaurant.min.js'))
		// .pipe(gzip())
		.pipe(gulp.dest('./js'))

	return indexJS, restaurantJS
}




// TINYPNG API
function tinifyImages() {
	return gulp
		.src(paths.images.src)
		.pipe(tinify('MFwWEQSnq2TzAHzF0nkr2qb985UPDDdB')) //my key
		.pipe(cleanDest(paths.styles.dest))
		.pipe(gulp.dest('./img/'))
}




// Tasks
gulp.task('watch', styles)
gulp.task('minifyJS', minifyJS)
gulp.task('concatJS', concatJS)
// gulp.task('inlineStyles', inlineStyles)
// gulp.task('copyFilesToDist', copyFilesToDist) // copy index.html to dist folder
// gulp.task('concatScripts', concatScripts) // minify js
gulp.task('responsive', responsiveImages)
gulp.task('makethumb', makethumb)
gulp.task('compressImages', compressImages) // best for jpg images
gulp.task('tinifyImages', tinifyImages) //best for png images, up to 500/month
gulp.task('webp', gulp.series(convertToWebp))


/*
 * Define default task that can be called by just running `gulp` from cli
 */
// gulp.task('default', styles, watch);
//on error, eg no png found, it breaks :(
gulp.task('default', gulp.series(responsiveImages,convertToWebp))
// gulp.task('default', gulp.series(styles, gulp.parallel(watch, browserSyncInit)))
gulp.task('default2', gulp.series(styles, minifyJS, concatJS, gulp.parallel(watch, browserSyncInit)))

gulp.task('rename', renameImages)

// to create webp execute
// 1. gulp responsiveImages
// 2. gulp webp

// ///////////////////////////////////////////////////////////////////////////////////
// https://gulpjs.com/docs/en/getting-started/async-completion/
// If nothing is returned from your task, 
// you must use the error - first callback to signal completion
function test(cb) {
    console.log('if you see this message gulp is executed ok!')
    cb()
}

exports.test = test