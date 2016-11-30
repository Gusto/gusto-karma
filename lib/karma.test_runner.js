/*eslint-env node*/
/*eslint no-console:0*/

var path = require('path');
var { RELATIVE_SPEC_DIR } = require('./utils/path');
require('spec/spec_helper');

const { args } = window.__karma__.config;
let FILE;
if (args[0]) {
  FILE = JSON.stringify(args[0]).replace(/"/g, '').replace(/frontend\/javascripts\/spec\//, '');
  console.log(`Running tests for: ${args[0]}`);
}

if (FIXTURES) { fixture.setBase(path.join(ROOT_DIR, RELATIVE_SPEC_DIR, 'fixtures')); }

const context = require.context('spec', true, /.*spec\..*/);
const filter = FILE ? (key) => key.match(FILE) : _.identity;
_.filter(context.keys(), filter).forEach(function(path) {
  try {
    context(path);
  } catch(err) {
    console.error('[ERROR] WITH SPEC FILE: ', path);
    console.error(err);
  }
});
