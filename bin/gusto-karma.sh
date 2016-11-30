#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
case "$1" in
  'test')
    echo 'Running Gusto-Karma Tests..'
    karma start node_modules/gusto-karma/lib/karma.config.js ${@:2:$#}
    ;;
  'server')
    echo 'Starting Gusto-Karma Server..'
    karma start node_modules/gusto-karma/lib/karma.config.js --no-single-run ${@:2:$#}
    ;;
  'run')
    echo "Running Gusto-Karma Tests for ${2}.."
    karma run node_modules/gusto-karma/lib/karma.config.js  -- $2
  *)
    echo 'Usage gusto-karma (test|server|)'
    exit 0
    ;;
esac

echo 'Success!';
exit 0;
