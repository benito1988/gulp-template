var gulp         = require('gulp'); //Подключаем gulp
var sass         = require('gulp-sass'); //Подключаем sass и т.д.
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var del          = require('del');
var imagemin     = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png

gulp.task('browser-sync', function(){
   browserSync.init({
        server: {
            baseDir: 'app'
        }
   });
});

gulp.task('sass', function() { //Создаем sass пакет
    return gulp.src(['app/sass/*.scss', 'app/sass/*.css']) //Берем источник
    .pipe(sass.sync().on('error', sass.logError)) //Переобразуем sass в css
    .pipe(autoprefixer({ browsers: ['last 5 versions', 'ie >= 9', 'iOS >= 8'], cascade: false}))
	.pipe(gulp.dest('app/css')) //Выгружаем результат в папку css
    .pipe(browserSync.reload({stream: true}))
});

gulp.task( 'css-libs', ['sass'], function() { //минимизируем css
    return gulp.src(['app/css/libs.css', 'app/css/normalize.css'])
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
});

gulp.task( 'script', function() { //минимизируем js
    return gulp.src('app/libs/jquery/dist/jquery.js')
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('app/js'))
});

gulp.task( 'clean', function(){
    return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/images/**/*')
		.pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}]
        }))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'script'], function(){
    gulp.watch('app/sass/**/*.scss', ['sass']); //Наблюдаем за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'script'], function(){
    var buildCss = gulp.src([
        'app/css/libs.min.css',
        'app/css/fontAwesome.min.css',
        'app/css/main.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['watch']);