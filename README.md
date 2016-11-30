# Gusto-Karma

An opinionated package for configuring Karma for use with Gusto-Webpack.

### Usage
Install Gusto-Karma along with Gusto-Webpack and it will provide several commands for working with the Karma server.
- *`gusto-karma test`* - Executes a single test run with all the tests in `frontend/javascripts/spec`. Exits after the run completes.
- *`gusto-karma server`* - Starts a test server that will watch the filesystem for changes and rerun tests on change.
- *`gusto-karma run <file>`* - If a test server is running, runs the tests for files matching the `<file>` path. Especially helpful when running the server with the `--no-auto-watch` flag.

Add a `karma.config.js` in `frontend/javascripts/spec` to configure specific Karma options and to configure:
```
module.exports = function (config) {
  config.set({
    gustoKarma: {
      fixtures: true
    }
  });
};

```

### Conventions
- Tests must live in `frontend/javascripts/spec` and be suffixed with `_spec`
- A `webpack.config.js` must be present in the root of the repository
- A `karma.config.js` must be present in `frontend/javascripts/spec`

### Configuration
- Karma will be loaded by default with the `mocha`, `sinon`, `chai`, `sinon-chai` frameworks.
- It will load all files containing `_spec` in `frontend/javascripts/spec` with the `webpack` and `sourcemap` Karma preprocessors.

#### In CI
When running in CI, Gusto-Karma will output both `mocha` and `junit` test results.
