var path = require('path');
var fs = require('fs');
var env = require('./utils/environment.js');
var IN_CI = env.IN_CI;
var NO_NOTIF = env.NO_NOTIF;
var paths = require('./utils/path');
var ROOT_DIR = paths.ROOT_DIR;
var SPEC_DIR = paths.SPEC_DIR;
var browserConfig = require('./utils/browsers');
var toastPlugin = require('./utils/toast_reporter');

var webpackConfig = require(path.join(ROOT_DIR, 'webpack.config.js'));
var karmaConfig = require(path.join(SPEC_DIR, 'karma.config'));

var karmaDevConfig;
try {
  karmaDevConfig = require(path.join(SPEC_DIR, 'karma.config.development_override'));
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
    // do nothing */
  } else {
    throw e;
  }
}

// Enzyme Patch https://github.com/airbnb/enzyme/issues/47
// https://github.com/webpack/webpack/issues/184
// https://github.com/producthunt/chai-enzyme/issues/46
delete webpackConfig.entry;
webpackConfig.resolve.extensions.push('.json');
webpackConfig.externals || (webpackConfig.externals = {});
webpackConfig.externals.jsdom = 'window';
webpackConfig.node = {
  __dirname: true,
  __filename: true
};

function toastEnabled(config) {
  if (IN_CI) { return false; }
  if (NO_NOTIF) { return false; }
  if (config.gustoKarma && config.gustoKarma.desktopNotifications === false) { return false; }
  return true;
}

module.exports = function(config) {
  karmaConfig(config);
  if (karmaDevConfig) { karmaDevConfig(config); }

  var options = config.gustoKarma || {};

  if (options.fixtures) {
    config.set({
      frameworks: ['fixture'],
      files: [
        { pattern: path.join(SPEC_DIR, 'fixtures/*') }
      ],
      preprocessors: {
        [path.join(SPEC_DIR, 'fixtures/*.json')]: ['json_fixtures']
      },
      jsonFixturesPreprocessor: { variableName: '__json__' }
    })
  }

  var webpack = require('webpack');
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      ROOT_DIR: JSON.stringify(path.resolve('.')),
      FIXTURES: !!options.fixtures
    })
  );

  webpackConfig.plugins.push(function () {
    this.plugin('done', function (stats) {
      if (stats.compilation.warnings.length) {
        // Log each of the warnings so it is clear why tests are hanging
        stats.compilation.warnings.forEach(function (warning) {
          console.log(warning.message || warning);
        });
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        stats.stats = [{
          toJson: function() {
            return this;
          },
          assets: []
        }];
      }
    });
  });

  config.set({
    frameworks: [
      'mocha',
      'sinon',
      'chai',
      'sinon-chai'
    ].concat(config.frameworks || []),
  });

  config.set({
    files: [
      path.resolve(__dirname, 'karma.test_runner.js')
    ].concat(config.files || [])
  });

  config.set({
    preprocessors: Object.assign({}, config.preprocessors || {}, {
      [path.resolve(__dirname, 'karma.test_runner.js')]: [ 'webpack', 'sourcemap' ]
    })
  });

  config.set(browserConfig);

  var reporters = ['mocha'].concat(config.reporters || []);
  var plugins = config.plugins;

  if (IN_CI) {
    reporters.push('junit');
  }

  if (toastEnabled(config)) {
    plugins.push(toastPlugin);
    reporters.push('toast');
  }

  config.set({
    singleRun: true,
    plugins: plugins,
    reporters: reporters,
    mochaReporter: {
      showDiff: true,
      output: 'minimal'
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true,
      stats: 'errors-only'
    }
  });

  if (IN_CI) {
    config.set({
      junitReporter: {
        outputDir: path.join(SPEC_DIR, 'results/'),
        outputFile: 'test.xml',
        useBrowserName: false
      }
    });
  }
};

// Stop the leaking!
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(1);
