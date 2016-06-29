var gulp = require('gulp'),
    D = new Date(),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    merge = require('gulp-merge-link'),
    zip = require('gulp-zip'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    connect = require('gulp-connect'),
    gulpOpen = require('gulp-open'),
    uncss = require('gulp-uncss'),
    scssSRC = 'app/css/index.scss',
    jsSRC = 'app/js/*.js'

gulp.task('sass', function() {
    return gulp.src(scssSRC)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
})

gulp.task('sass:watch', function() {
    gulp.watch('app/css/*.scss', ['sass'])
})

gulp.task('mergejs', function() {
    return gulp.src(jsSRC)
        .pipe(concat('merged.js'))
        .pipe(gulp.dest('app'))
})

gulp.task('mergecss', ['sass'], function() {
    return gulp.src('app/css/*.css')
        .pipe(concatCss("merged.css"))
        .pipe(gulp.dest('app'));
});

gulp.task('minicss', ['mergecss', 'sass'], function() {
    return gulp.src('app/merged.css')
        .pipe(uncss({
            html: ['app/*.html']
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('DIST'));
});

gulp.task('minijs', ['mergejs'], function() {
    return gulp.src('app/merged.js')
        .pipe(uglify())
        .pipe(gulp.dest('DIST'))
});

gulp.task('merge', ['minicss', 'minijs', 'sass'], function() {
    return gulp.src('app/index.html')
        .pipe(merge({
            'merged.css': ['css/*.css'],
            'merged.js': ['js/*.js']
        }))
        .pipe(gulp.dest('DIST'));
});

gulp.task('zip', ['merge', 'miniimg'], function() {
    return gulp.src(['DIST/**'])
        .pipe(zip(D.getHours() + '-' + D.getMinutes() + '-' + D.getSeconds() + '.zip'))
        .pipe(gulp.dest('./'))
})

gulp.task('miniimg', function() {
    return gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('DIST/img'))
});

gulp.task('reload', function() {
    return gulp.src(['app/*.html', 'app/js/*.js', 'app/css/*.scss', 'app/img/*'])
        .pipe(connect.reload());
});

gulp.task('b', ['sass', 'mergejs', 'mergecss', 'minijs', 'minicss', 'merge', 'miniimg', 'zip'], function() {
    console.log('building files')
})

gulp.task('web', function() {
    connect.server({
        port: 8878,
        livereload: true
    });
    gulp.src(['app/index.html'])
        .pipe(gulpOpen({
            uri: 'http://localhost:8878/app'
        }));
});

gulp.task('w', ['web', 'sass'], function() {
    gulp.watch('app/css/*.scss', ['sass', 'reload'])
    gulp.watch('app/js/*.js', ['reload'])
    gulp.watch('app/img/*', ['reload'])
    gulp.watch('app/*.html', ['reload'])
})

gulp.task('default', ['web']);