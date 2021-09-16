let proj_folder = "dist";
let src_folder = "src";
let fs = require('fs')


let path = {
    build: {
        html: proj_folder + "/",
        css: proj_folder + "/assets/css/",
        js: proj_folder + "/assets/js/",
        img: proj_folder + "/assets/img/",
        fonts: proj_folder + "/assets/fonts/"
    },
    src: {
        html: [src_folder + "/*.html", "!" + src_folder + "/_*.html"],
        css: src_folder + "/assets/scss/style.scss",
        js: src_folder + "/assets/js/index.js",
        img: src_folder + "/assets/img/**/*.{jpeg,jpg,png,svg, webp, gif}",
        fonts: src_folder + "/assets/fonts/*.ttf"
    },
    watch: {
        html: src_folder + "/**/*.html",
        css: src_folder + "/assets/scss/**/*.scss",
        js: src_folder + "/assets/js/**/*.js",
        img: src_folder + "/assets/img/**/*.{jpeg,jpg,png,svg, webp, gif}",
    },
    clean: "./" + proj_folder + "/"
}


let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webp-css'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter')

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + proj_folder + "/",
        },
        port: 3010,
        notify: false
    })
}

function html(params) {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css(params) {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({ extname: ".min.css" })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js(params) {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({ extname: ".min.js" })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(params) {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationlavel: 3 // from 0 to 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function fontsStyle() {
    let file_content = fs.readFileSync(src_folder + '/assets/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(src_folder + '/assets/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(src_folder + '/assets/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {

}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
}

gulp.task('otf2ttf', function () {
    return src([src_folder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(src_folder + '/fonts/'))
})

function clean(params) {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(images, css, js, html, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.build = build;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.watch = watch;
exports.default = watch;