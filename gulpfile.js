const gulp = require('gulp'),
    del = require('del'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    cssnano = require('cssnano'),
    cssmin = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    cachebust = require('gulp-cache-bust'),
    webpack = require('webpack-stream'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    stream = browserSync.stream;

const config = {
    paths: {
        vendor: {
            js: [],
            css: []
        },
        css: [
            './src/css/**/*.css'
        ],
        less: [
            './src/less/*.less',
        ],
        js: [
            './src/**/*.js'
        ],
        sw: [
            './src/**/*-sw.js'
        ],
        app: './src/app.js',
        html: ['./src/*.html'],
        fonts: [],
        images: './src/images/**/*.*',
    },
    dest: {
        static: {
            css: 'dist/static/css',
            js: 'dist/static/js',
            sw: 'dist/static/js/sw',
            images: 'dist/static/images',
            fonts: 'dist/static/fonts',
            sw: 'dist/static/js/sw',
        },
        vendor_css: 'vendor.css',
        vendor_js: 'vendor.js',
        app_css: 'style.css',
        app: 'dist',
        dist: 'dist',
        less: 'src/css',
    }
};


/**
 * Cleaning dist/ folder
 */

gulp.task('clean', function(cb) {
    del([config.dest.dist + '/**'], cb).then((paths) => {
        console.log('Deleted files and folders:\n', paths.join('\n'))
    });
});

// run browser sync server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: config.dest.dist,
            index: 'index.html',
            routes: {}
        }
    });
});

gulp.task('login', function() {
    browserSync({
        server: {
            baseDir: config.dest.dist,
            index: 'login.html'
        }
    });
});

gulp.task('vendor:css', function() {
    return gulp.src(config.paths.vendor.css)
        .pipe(concat(config.dest.vendor_css))
        .pipe(postcss([
            cssnano({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(gulp.dest(config.dest.static.css))
        .pipe(stream());
});

gulp.task('vendor:js', function() {
    return gulp.src(config.paths.vendor.js)
        .pipe(concat(config.dest.vendor_js))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.static.js))
        .pipe(stream());
});

gulp.task('html', function() {
    return gulp.src(config.paths.html)
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest(config.dest.dist))
        .pipe(stream())
});

gulp.task('images', function() {
    return gulp.src(config.paths.images)
        .pipe(gulp.dest(config.dest.static.images))
        .pipe(stream())

});

gulp.task('sw', function() {
    return gulp.src(config.paths.sw)
        .pipe(gulp.dest(config.dest.static.sw))
        .pipe(stream())

});

gulp.task('fonts', function() {
    return gulp.src(config.paths.fonts)
        .pipe(gulp.dest(config.dest.static.fonts))

});

gulp.task('less', function() {
    return gulp.src(config.paths.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(config.dest.less))

});

gulp.task('css', ['less'], function() {
    return gulp.src(config.paths.css)
        .pipe(concat(config.dest.app_css))
        .pipe(postcss([require('autoprefixer')]))
        .pipe(gulp.dest(config.dest.static.css))
        .pipe(stream())

});

gulp.task('css:min', ['less'], function() {
    return gulp.src(config.paths.css)
        .pipe(concat(config.dest.style))
        .pipe(postcss([
            cssnano({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(gulp.dest(config.dest.dist))

});

gulp.task('js', ['sw'], function() {
    return gulp.src(config.paths.app)
        .pipe(webpack(require('./webpack.config.dev.js')))
        .pipe(gulp.dest(config.dest.static.js))
});
gulp.task('js:min', function() {
    return gulp.src(config.paths.js)
        .pipe(webpack(require('./webpack.config.prod.js')))
        .pipe(gulp.dest(config.dest.static.js))
});

// Watches
gulp.task('watch:html', function() {
    return gulp.watch(
        [
            config.paths.html
        ], [
            'html'
        ],
        function() {
          console.log('done')
            reload();
            done();
        });
});
gulp.task('watch:images', function() {
    return gulp.watch(
        [
            config.paths.images
        ], [
            'images',reload
        ],
        function() {
          console.log('done')
            reload();
            done();
        });
});
gulp.task('watch:less', function() {
    return gulp.watch(
        [
            config.paths.less
        ], [
            'css', reload
        ]);
});
gulp.task('watch:sw', function() {
    return gulp.watch(
        [
            config.paths.sw
        ], [
            'sw'
        ],
        function() {
          console.log('done')
            browserSync.reload();
            done();
        });
});
gulp.task('watch:js', function() {
    return gulp.watch(
        [
           config.paths.js
        ],[
            'js',reload
        ]);
});
gulp.task('watch', ['watch:html', 'watch:images', 'watch:less', 'watch:sw','watch:js']);

gulp.task('run', ['html', 'images', 'css', 'js', 'fonts', 'vendor:js', 'vendor:css', 'watch', 'sw', 'server']);
gulp.task('build', ['html', 'images', 'css', 'fonts', 'vendor:js', 'vendor:css', 'js']);
gulp.task('build:min', ['html', 'images', 'css:min', 'js:min']);

gulp.task('default', ['run']);
