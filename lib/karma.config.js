var path = require('path');
var { IN_CI } = require('./utils/environment.js');
var browsers = require('./utils/browsers');

var webpackConfig = require(path.resolve('webpack.config.js'));
var karmaConfig = require(path.resolve('frontend/javascripts/spec/karma.config'));

// Enzyme Patch https://github.com/airbnb/enzyme/issues/47
// https://github.com/webpack/webpack/issues/184
// https://github.com/producthunt/chai-enzyme/issues/46
webpackConfig.entry = {};
webpackConfig.progress = false;
webpackConfig.resolve.extensions.push('.json');
webpackConfig.externals = {
  'jsdom': 'window'
};
webpackConfig.node = {
  __dirname: true,
  __filename: true
};
var { DefinePlugin } = require('webpack');
webpackConfig.plugins.push(
  new DefinePlugin({
    ROOT_DIR: JSON.stringify(path.resolve('.'))
  })
);

var config = function(config) {
  karmaConfig(config);
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

  config.set({
    browsers: browsers,
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
        outputDir: 'results/',
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

module.exports = config;
