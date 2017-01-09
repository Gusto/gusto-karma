/*eslint-env node*/
/*eslint no-console:0*/

var path = require('path');
var paths = require('./utils/path');
var SPEC_DIR = paths.SPEC_DIR;
var RELATIVE_SPEC_DIR = paths.RELATIVE_SPEC_DIR;

var fs = require('fs');
var specHelperExists = fs.readdirSync(SPEC_DIR).find(function(f) {
  return f.indexOf('spec_helper.') >= 0
});
if (specHelperExists) { require('spec/spec_helper'); }

var args = window.__karma__.config.args;
var FILE;
if (args[0]) {
  FILE = JSON.stringify(args[0]).replace(/"/g, '').replace(/frontend\/javascripts\/spec\//, '');
  console.log('Running tests for: ' + args[0]);
}

if (FIXTURES) { fixture.setBase(path.join(ROOT_DIR, RELATIVE_SPEC_DIR, 'fixtures')); }

var context = require.context('spec', true, /.*spec\..*/);
var filter = FILE ? function(key) { return key.match(FILE); } : _.identity;
_.filter(context.keys(), filter).forEach(function(path) {
  try {
    context(path);
  } catch(err) {
    console.error('[ERROR]: ', path);
    throw err;
  }
});
