var { IN_CI } = require('./environment');

function browsersSelection(env, inCI) {
  if (IN_CI || process.env.KARMA_BROWSER === 'phantom') {
    return ['PhantomJS'];
  } else {
    return ['Chrome'];
  }
}

module.exports = browsersSelection(process.env, IN_CI)
