'use strict';

import gulp from 'gulp';
import lazypipe from 'lazypipe';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import { Instrumenter } from 'isparta';

var plugins = gulpLoadPlugins();

const apiPath = 'api';
const backendPath = 'backend';
const paths = {
    api: {
      scripts: `${apiPath}/**/!(*.spec|*.mock|*.integration|*index).js`,
      test: {
        integration: [`${apiPath}/**/*.integration.js`, 'mocha.global.js'],
        unit: [`${apiPath}/**/*.spec.js`, 'mocha.global.js']
      }
    },
    backend: {
        scripts: `${backendPath}/**/!(*.spec|*.mock|*.integration|*index).js`,
        test: {
          integration: [`${backendPath}/**/*.integration.js`, 'mocha.global.js'],
          unit: [`${backendPath}/**/*.spec.js`]
        }
    }
};

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports)
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory : ''
    });

gulp.task('backend:mocha:unit', () => {
    return gulp.src(paths.backend.test.unit)
        .pipe(mocha());
});

gulp.task('backend:mocha:integration', () => {
    return gulp.src(paths.backend.test.integration)
        .pipe(mocha());
});

gulp.task('api:mocha:integration', () => {
    var backend = plugins.nodemon({ script: './backend' });

    return gulp.src(paths.api.test.integration)
        .pipe(mocha())
        .once('end', function() {
          process.exit();
        })
});

gulp.task('test', cb => {
    return runSequence('test:backend', 'test:api', cb);
});

gulp.task('test:backend', cb => {
    return runSequence(
        'backend:mocha:unit',
        'backend:mocha:integration',
        cb);
});

gulp.task('test:api', cb => {
    return runSequence(
        'api:mocha:integration',
        cb);
});

gulp.task('test:coverage', cb => {
  runSequence(
    'coverage:pre',
    'test:backend:coverage',
    'test:api:coverage',
    cb);
});

gulp.task('test:api:coverage', cb => {
  runSequence(
              'api:coverage:integration',
              cb);
});

gulp.task('test:backend:coverage', cb => {
  runSequence(
              'backend:coverage:unit',
              'backend:coverage:integration',
              cb);
});

gulp.task('coverage:pre', () => {
  return gulp.src([ paths.api.scripts, paths.backend.scripts ])
    .pipe(plugins.istanbul({
        instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
        includeUntested: true
    }))
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('api:coverage:integration', () => {
    return gulp.src(paths.api.test.integration)
        .pipe(mocha())
        .pipe(istanbul());
});

gulp.task('backend:coverage:unit', () => {
    return gulp.src(paths.backend.test.unit)
        .pipe(mocha());
});

gulp.task('backend:coverage:integration', () => {
    return gulp.src(paths.backend.test.integration)
        .pipe(mocha())
        .pipe(istanbul());
});
