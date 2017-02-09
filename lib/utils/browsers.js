var path = require('path');
var env = require('./environment');
var IN_CI = env.IN_CI;

function browsersSelection(env, inCI) {
  if (IN_CI || process.env.KARMA_BROWSER === 'phantom') {
    return ['PhantomJS'];
  } else {
    return ['Chrome_with_debugging'];
  }
}

module.exports = {
  browsers: browsersSelection(process.env, IN_CI),
  customLaunchers: {
    Chrome_with_debugging: {
      base: 'Chrome',
      chromeDataDir: path.resolve(process.cwd(), 'tmp/.chrome')
    }
  }
};
