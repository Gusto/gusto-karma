#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
case "$1" in
  'test')
    echo 'Running Gusto-Karma Tests..'
    karma start node_modules/gusto-karma/lib/karma.config.js
    ;;
  'server')
    echo 'Starting Gusto-Karma Server..'
    karma start node_modules/gusto-karma/lib/karma.config.js --no-single-run
    ;;
  *)
    echo 'Usage gusto-karma (profile|build|watch)'
    exit 0
    ;;
esac

echo 'Success!';
exit 0;
