import pkg from 'gulp';
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import {deleteAsync} from 'del';
import gmode from 'gulp-mode';
import browsersync from 'browser-sync';

const mode = gmode(),
      browserSync = browsersync.create(),
      { src, dest, watch, series, parallel } = pkg;


const clean = () => {
  return deleteAsync(['dist']);
}

const cleanImages = () => {
  return deleteAsync(['dist/assets/images']);
}


const css = () => {
  return src('src/scss/index.scss')
    .pipe(mode.development( sourcemaps.init() ))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('app.css'))
    .pipe(mode.production( csso() ))
    .pipe(mode.development( sourcemaps.write() ))
    .pipe(dest('dist'))
    .pipe(mode.development( browserSync.stream() ));
}


const js = () => {
  return src('src/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(webpack({
      mode: 'development',
      devtool: 'inline-source-map'
    }))
    .pipe(mode.development( sourcemaps.init({ loadMaps: true }) ))
    .pipe(rename('app.js'))
    .pipe(mode.production( terser({ output: { comments: false }}) ))
    .pipe(mode.development( sourcemaps.write() ))
    .pipe(dest('dist'))
    .pipe(mode.development( browserSync.stream() ));
}


const copyImages = () => {
  return src('src/assets/images/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(dest('dist/assets/images'));
}



const watchForChanges = () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  watch('src/scss/**/*.scss', css);
  watch('src/**/*.js', js);
  watch('**/*.html').on('change', browserSync.reload);
  watch('src/assets/images/**/*.{png,jpg,jpeg,gif,svg}', series(cleanImages, copyImages));
}


export let build = series(clean, parallel(css, js, copyImages));
let watches = series(build, watchForChanges);
export default watches;