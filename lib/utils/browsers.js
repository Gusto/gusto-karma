var path = require('path');
var env = require('./environment');
var IN_CI = env.IN_CI;

function browsersSelection(env, inCI) {
  if (IN_CI || process.env.KARMA_BROWSER === 'phantom') {
    return ['PhantomJS'];
  } else if (process.env.KARMA_BROWSER === 'chrome_headless') {
    return ['ChromeHeadless'];
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
    },
    ChromeHeadless: {
      base: 'Chrome',
      chromeDataDir: path.resolve(process.cwd(), 'tmp/.chrome_headless'),
      flags: [
        '--no-sandbox',
        // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
        '--headless',
        '--disable-gpu',
        // Without a remote debugging port, Google Chrome exits immediately.
        ' --remote-debugging-port=9222',
      ]
    }
  }
};

