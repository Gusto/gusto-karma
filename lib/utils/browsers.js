var path = require('path');
var env = require('./environment');
var IN_CI = env.IN_CI;

function browsersSelection(env, inCI) {
  if (IN_CI || process.env.KARMA_BROWSER === 'phantom') {
    return ['PhantomJS'];
  } else if (process.env.KARMA_BROWSER === 'chrome_headless') {
    return ['ChromeHeadless_with_debugging'];
  } else {
    return ['Chrome_with_debugging'];
  }
}

function flags(env) {
  if (env.KARMA_MAX_OLD_SPACE_SIZE) {
    return ['--js-flags="--max_old_space_size=' + env.KARMA_MAX_OLD_SPACE_SIZE + '"'];
  } else {
    return [];
  }
}

module.exports = {
  browsers: browsersSelection(process.env, IN_CI),
  customLaunchers: {
    Chrome_with_debugging: {
      base: 'Chrome',
      chromeDataDir: path.resolve(process.cwd(), 'tmp/.chrome'),
      flags: flags(process.env)
    },
    ChromeHeadless_with_debugging: {
      base: 'ChromeHeadless',
      chromeDataDir: path.resolve(process.cwd(), 'tmp/.chrome_headless'),
      flags: flags(process.env)
    }
  }
};
