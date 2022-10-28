import gulp from 'gulp';
import less from 'gulp-less';
const {parallel,series} = gulp
import rename from 'gulp-rename';
import babel from 'gulp-babel'
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import ejs from 'gulp-ejs';
import htmlmin from 'gulp-htmlmin'


function lessTask(cb) {
    console.log('less')
    gulp.src('src/client/less/**/*.less')
        .pipe(less({paths:[
                '.',
                './node_modules/bootstrap-less'
            ]})).pipe(cleanCSS())
        .pipe(gulp.dest('./dist/gulp/assets'));
    cb()
}

function cssTask(cb) {
    console.log('less')
    gulp.src('src/client/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/gulp/assets'));
    cb()
}

function ejsTask(cb) {
    gulp.src('src/client/views/pages/*.ejs')
        .pipe(ejs({gulp:true}))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('dist/gulp/'))
    cb()
}

async function babelTask(cb) {
    gulp.src('src/client/js/*.js')

        .pipe(babel({
            presets: ['@babel/env']
        })).pipe(uglify())
        .pipe(gulp.dest('dist/gulp/assets'))
    cb()
}

function assetsTask(cb) {
    gulp.src('assets/*').pipe(gulp.dest('dist/gulp/assets'))
    cb()
}

function debugTask(cb) {
    gulp.src('src/client/js/*.js')
        .pipe(rename({suffix: '.debug'}))
        .pipe(gulp.dest('dist/gulp/assets'))
    cb()
}


function defaultTask(cb) {
    // place code for your default task here
    console.log("task")
    cb();
}

export {lessTask}
export {babelTask}
let build=parallel(lessTask, babelTask,cssTask,ejsTask,assetsTask)
export {build}
export {debugTask}
export {ejsTask}
export default defaultTask