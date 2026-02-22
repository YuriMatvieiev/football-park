const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const os = require("os");

// Paths
const paths = {
  html: {
    src: "src/**/*.html",
    dest: "dist/",
  },
  scss: {
    src: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  assets: {
    src: "src/assets/**/*",
    dest: "dist/assets/",
  },
  components: {
    js: "src/components/**/*.js",
    dest: "dist/assets/js/",
  },
};

// Compile SCSS
function compileScss() {
  return gulp
    .src("src/scss/main.scss")
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: ["src/scss", "src/components", "node_modules"],
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Include HTML components (if you decide to use @@include)
function includeHtml() {
  return gulp
    .src(["src/*.html", "!src/components/**/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Copy assets
function copyAssets() {
  return gulp
    .src(paths.assets.src, { allowEmpty: true })
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

// Copy normalize.css so @import in main.css resolves (404 fix)
function copyNormalizeCss() {
  return gulp
    .src("node_modules/normalize.css/normalize.css")
    .pipe(gulp.dest("dist/css/normalize.css"))
    .pipe(browserSync.stream());
}

// Bundle component JS files into one file
function bundleComponentJs() {
  return gulp
    .src(paths.components.js, { allowEmpty: true })
    .pipe(concat("main.js"))
    .pipe(gulp.dest(paths.components.dest))
    .pipe(browserSync.stream());
}

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "192.168.0.105"; // Fallback
}

// Browser Sync
function serve() {
  const localIP = getLocalIP();

  const bsConfig = {
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    host: "0.0.0.0",
    open: false,
    notify: false,
    ui: {
      port: 3001,
    },
    online: true,
  };

  browserSync.init(bsConfig, function (err) {
    if (!err) {
      console.log("\n✅ [Browsersync] Server started successfully!");
      console.log("\n📍 Access URLs:");
      console.log(`   Local:    http://localhost:3000`);
      console.log(`   Network:  http://${localIP}:3000`);
    } else {
      console.error("❌ Error starting BrowserSync:", err);
    }
  });

  gulp.watch(paths.scss.src, compileScss);
  gulp.watch("src/components/**/*.scss", compileScss);
  gulp.watch(paths.html.src, includeHtml);
  gulp.watch(paths.assets.src, copyAssets);
  gulp.watch(paths.components.js, bundleComponentJs);
}

// Build task
const build = gulp.series(
  gulp.parallel(compileScss, includeHtml, copyAssets, copyNormalizeCss, bundleComponentJs)
);

// Default task
const dev = gulp.series(
  gulp.parallel(compileScss, includeHtml, copyAssets, copyNormalizeCss, bundleComponentJs),
  serve
);

exports.compileScss = compileScss;
exports.includeHtml = includeHtml;
exports.copyAssets = copyAssets;
exports.copyNormalizeCss = copyNormalizeCss;
exports.bundleComponentJs = bundleComponentJs;
exports.build = build;
exports.default = dev;
