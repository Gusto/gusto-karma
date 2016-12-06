var env = require('./environment');
var IN_CI = env.IN_CI;

function browsersSelection(env, inCI) {
  if (IN_CI || process.env.KARMA_BROWSER === 'phantom') {
    return ['PhantomJS'];
  } else {
    return ['Chrome'];
  }
}

module.exports = browsersSelection(process.env, IN_CI)
