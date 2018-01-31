var gulp            = require('gulp'),
    compass         = require('gulp-compass'),
    jade            = require('gulp-jade'),
    server          = require('gulp-server-livereload')
;
/** 
 * Configuración del 'server'
 * 
 */
gulp.task('webserver', function() {
    gulp.src('./dist').pipe(server({
        path                : './dist',
        port                : 4000,
        directoryListing    : false,
        open                : true,
        livereload:{
            enable: true,
            port: 4010
        }
    }));
});
/* Configuración de la tarea 'jade' */
gulp.task('jade', function() {
    var YOUR_LOCALS = {};
    gulp.src('./src/jade/*.jade')
    .pipe(jade({
            pretty: true,
            locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'));
});
/**
 * Generate css
 */
gulp.task('compass', function(){
    gulp.src('./src/sass/*.sass')
    .pipe(compass({
        config_file: './src/config.rb',
        css: './dist/css',
        sass: 'src/sass'
    }))
    .on('error', function(error){
        console.log(error);
    })
    .pipe(gulp.dest('./dist/css'));
});
/**
 * Simple Task
 */
gulp.task('js', function() {
    gulp.run('jade');
    //gulp.run('compass');
    gulp.run('webserver');
});

gulp.task('default', ['js']);