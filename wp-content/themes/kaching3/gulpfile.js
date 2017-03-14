'use strict';

var gulp        = require('gulp');
var debug       = require('gulp-debug');
var del         = require('del');
var fs          = require('fs');
var concat      = require('gulp-concat');
var flatten     = require('gulp-flatten');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var wrap        = require('gulp-wrap');
var ngAnnotate  = require('gulp-ng-annotate');
var minify      = require('gulp-minify');
var htmlmin     = require('gulp-htmlmin');
var tmplCache   = require('gulp-angular-templatecache');
var browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

var config = JSON.parse(fs.readFileSync('./build-config.json'));

var distPath = './dist';

gulp.task('fonts', function() {
    return gulp.src([
            './assets/fonts/**/*',
            './bower-components/bootstrap-sass/assets/fonts/**/*',
            './bower-components/Ionicons/fonts/*'
        ])
        .pipe(flatten())
        .pipe(gulp.dest( distPath + '/fonts/' ));
});

gulp.task('images', function() {
    return gulp.src( [
            './assets/images/**/*',
            './assets/kaching/**/*.+(svg|png|jpg|gif)'
        ] )
        .pipe(flatten())
        .pipe(gulp.dest( distPath + '/images/' ));
});

gulp.task('sass', function () {
    return gulp.src( config.css.main )
         .pipe( sourcemaps.init() )
        .pipe( sass().on('error', sass.logError) )
        //.pipe(debug({title: 'DEBUG CSS MAIN:'}))
        .pipe(concat('main.css'))
         .pipe(sourcemaps.write('.'))
        .pipe( gulp.dest( distPath + '/css/' ) );
});

gulp.task('concatLibsCss', function() {
    return gulp.src( config.css.libs )
        //.pipe(debug({title: 'DEBUG CSS LIBS:'}))
        .pipe(concat('libs.css'))
        .pipe(gulp.dest( distPath + '/css/' ));
});

gulp.task('copyFontAwesome', function() {
    return gulp.src( config.css.fontawesomeWebfont )
        .pipe(debug({title: 'DEBUG CSS LIBS:'}))
        .pipe(flatten())
        // .pipe(concat('libs.css'))
        .pipe(gulp.dest( distPath + '/fonts/' ));
});

gulp.task('copyCssMaps', function() {
    return gulp.src( config.css.maps )
        .pipe(debug({title: 'DEBUG CSS LIBS:'}))
        .pipe(flatten())
        // .pipe(concat('libs.css'))
        .pipe(gulp.dest( distPath + '/css/' ));
});

gulp.task('concatLibsCoreJs', function() {
    return gulp.src( config.js.libsCore )
        .pipe(sourcemaps.init())
        //.pipe(debug({title: 'concatLibsCoreJs:'}))
        .pipe(concat('libsCore.js'))
        .pipe(wrap('(function($){\n<%= contents %>\n})(jQuery);'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( distPath + '/js/' ));
});

gulp.task('concatLibsPanelJs', function() {
    return gulp.src( config.js.libsPanel )
        .pipe(sourcemaps.init())
        //.pipe(debug({title: 'concatLibsPanelJs:'}))
        .pipe(concat('libsPanel.js'))
        .pipe(wrap('(function($){\n<%= contents %>\n})(jQuery);'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( distPath + '/js/' ));
});

gulp.task('concatPanelApp', ['jshintPanelApp'], function() {
    return gulp.src( config.js.panelApp )
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('panelApp.js'))
        // .pipe(wrap('(function($){\n<%= contents %>\n})(jQuery);'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( distPath + '/js/' ));
});

gulp.task('concatKachingCore', ['jshintKachingCore'], function() {
    return gulp.src( config.js.kachingCore )
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('kachingCore.js'))
        .pipe(wrap('(function($){\n<%= contents %>\n})(jQuery);'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( distPath + '/js/' ));
});

gulp.task('jshintPanelApp', function() {
    return gulp.src( config.js.panelApp )
        //.pipe(debug({title: 'DEBUG:'}))
        .pipe(jshint())
        .pipe(jshint.reporter( stylish ));
});

gulp.task('jshintKachingCore', function() {
    return gulp.src( config.js.kachingCore )
        //.pipe(debug({title: 'DEBUG:'}))
        .pipe(jshint())
        .pipe(jshint.reporter( stylish ));
});

gulp.task('scripts', [
    'concatLibsCoreJs',
    'concatLibsPanelJs',
    'concatKachingCore',
    'concatPanelApp'
]);

gulp.task('browser-sync', ['scripts'], function() {
    browserSync.init({
        proxy: {
            target: '127.0.0.1:8888', // can be [virtual host, sub-directory, localhost with port]
        }
    });
    gulp.watch( 'assets/**/*.js', [ 'concatKachingCore',
        'concatPanelApp'
    ] );
	gulp.watch( 'assets/**/*.scss', ['sass'] );
    gulp.watch( 'dist/js/*.js' ).on('change', browserSync.reload);
    gulp.watch( 'assets/**/*.html').on('change', browserSync.reload);
});

gulp.task('watch', ['build'], function() {
    gulp.watch( 'assets/**/*.js', [ 'concatKachingCore',
        'concatPanelApp'
    ] );
	gulp.watch( 'assets/**/*.scss', ['sass'] );
});

gulp.task('clean', function () {
    return del([distPath]);
});

gulp.task('build', function() {
    runSequence(
        'clean',
        'fonts',
        'images',
        'sass',
        'concatLibsCss',
        'scripts',
        'copyFontAwesome',
        'copyCssMaps'
    );
});

gulp.task('default', [
	'watch'
]);
