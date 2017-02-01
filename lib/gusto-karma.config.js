var path = require('path');
var env = require('./utils/environment.js');
var IN_CI = env.IN_CI;
var paths = require('./utils/path');
var ROOT_DIR = paths.ROOT_DIR;
var SPEC_DIR = paths.SPEC_DIR;
var browserConfig = require('./utils/browsers');

var webpackConfig = require(path.join(ROOT_DIR, 'webpack.config.js'));
var karmaConfig = require(path.join(SPEC_DIR, 'karma.config'));

// Enzyme Patch https://github.com/airbnb/enzyme/issues/47
// https://github.com/webpack/webpack/issues/184
// https://github.com/producthunt/chai-enzyme/issues/46
webpackConfig.entry = {};
webpackConfig.progress = false;
webpackConfig.resolve.extensions.push('.json');
webpackConfig.externals || (webpackConfig.externals = {});
webpackConfig.externals.jsdom = 'window';
webpackConfig.externals['react-dom'] = true;
webpackConfig.externals['react-dom/server'] = true;
webpackConfig.externals['react-addons-test-utils'] = true;
webpackConfig.node = {
  __dirname: true,
  __filename: true
};

module.exports = function(config) {
  karmaConfig(config);

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

  config.set({
    singleRun: true,
    reporters: IN_CI ? ['mocha', 'junit'] : ['mocha'],
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
