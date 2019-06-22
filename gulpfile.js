var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    filter = require('gulp-filter'),
    plugin = require('gulp-load-plugins')();

// const LOCAL_URL = 'http://localhost:3000/';

const SOURCE = {
  scripts: [
    'scripts/js/*.js'
  ],
  styles: [
    'styles/scss/*.scss'
  ]
};

const ASSETS = {
  styles: 'styles/',
  scripts: 'scripts/'
};

const JSHINT_CONFIG = {
	"node": true,
	"globals": {
		"document": true,
		"jQuery": true
	}
};

// GULP FUNCTIONS
// JSHint, concat, and minify JavaScript
gulp.task('scripts', function() {

	// Use a custom filter so we only lint custom JS
	// const CUSTOMFILTER = filter(ASSETS.scripts + 'js/**/*.js', {restore: true});

	return gulp.src(SOURCE.scripts)
		.pipe(plugin.plumber(function(error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit('end');
		}))
		.pipe(plugin.sourcemaps.init())
		.pipe(plugin.babel({
			presets: ['es2015'],
			compact: true
		}))
		// .pipe(CUSTOMFILTER)
		// 	.pipe(plugin.jshint(JSHINT_CONFIG))
			.pipe(plugin.jshint.reporter('jshint-stylish'))
			// .pipe(CUSTOMFILTER.restore)
		.pipe(plugin.concat('scripts.js'))
		.pipe(plugin.uglify())
		.pipe(plugin.sourcemaps.write('.'))
		.pipe(gulp.dest(ASSETS.scripts))
});

// Compile Sass, Autoprefix and minify
gulp.task('styles', function () {
  return gulp.src(SOURCE.styles)
    .pipe(plugin.plumber(function (error) {
      gutil.log(gutil.colors.cyan(error.message));
      this.emit('end');
    }))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass())
    .pipe(plugin.autoprefixer({
      browsers: [
        'last 2 versions',
        'ie >= 9',
        'ios >= 7'
      ],
      cascade: false
    }))
    .pipe(plugin.cssnano())
    .pipe(plugin.sourcemaps.write('.'))
    .pipe(gulp.dest(ASSETS.styles))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// gulp.task('browserSync', function() {
//   browserSync.init({
//     proxy: LOCAL_URL,
//   });
//   gulp.watch(SOURCE.styles, gulp.parallel('styles'));
//   gulp.watch(SOURCE.scripts, gulp.parallel('scripts')).on('change', browserSync.reload);
// });

gulp.task('watch', function() {
  gulp.watch(SOURCE.styles, gulp.parallel('styles'));
  gulp.watch(SOURCE.scripts, gulp.parallel('scripts'));
});

gulp.task('default', gulp.parallel('styles', 'scripts'));