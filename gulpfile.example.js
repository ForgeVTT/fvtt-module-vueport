const gulp = require('gulp');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const minify = require('gulp-minify');
const path = require('path');
const vueComponent = require('gulp-vue-single-file-component');
const babel = require('gulp-babel');
 
const VUE_FILES = ["vue/**/*.vue"];

vue = () => gulp.src(VUE_FILES)
        .pipe(vueComponent({ loadCssMethod: 'VuePort.loadCss' }))
        .pipe(babel({ plugins: ['@babel/plugin-transform-modules-commonjs'] }))
        .pipe(wrap('Vue.component(<%= processComponentName(file.relative) %>, (function() {const exports = {}; <%= contents %>; return _default;})())', {}, {
            imports: {
                processComponentName: function (fileName) {
                    // Strip the extension and escape the output with JSON.stringify
                    return JSON.stringify(path.basename(fileName, '.js'));
                }
            }
        }))
        .pipe(declare({
            namespace: 'VuePort.Components',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('vue-components.js'))

    .pipe(minify({ noSource: true, ext: ".min.js" }))
        .pipe(gulp.dest('dist/'));

watch = () => gulp.watch(VUE_FILES, vue);


gulp.task('watch', watch);
gulp.task('build', vue);
gulp.task('default', gulp.series(vue, watch));
