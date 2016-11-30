/*eslint-env node*/
/*eslint no-console:0*/

var path = require('path');
require('spec/spec_helper');

const { args } = window.__karma__.config;
let FILE;
if (args[0]) {
  FILE = JSON.stringify(args[0]).replace(/"/g, '').replace(/frontend\/javascripts\/spec\//, '');
  console.log(`Running tests for: ${args[0]}`);
}

const context = require.context('spec', true, /.*spec\..*/);
const filter = FILE ? (key) => key.match(FILE) : _.identity;
_.filter(context.keys(), filter).forEach(context);
