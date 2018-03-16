var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('bundle', function() {
    return gulp.src(['styles/*.min.css'])
		.pipe(concat('style.css'))
		.pipe(gulp.dest('styles'));
});

