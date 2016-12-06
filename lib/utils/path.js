var path = require('path');

var RELATIVE_SPEC_DIR = 'frontend/javascripts/spec';
module.exports = {
  ROOT_DIR: path.resolve('.'),
  SPEC_DIR: path.resolve(RELATIVE_SPEC_DIR),
  RELATIVE_SPEC_DIR: RELATIVE_SPEC_DIR
};
