var notifier = require('node-notifier');

var ToastReporter = function(baseReporterDecorator) {
  baseReporterDecorator(this);

  this.onRunComplete = function(browsers, results) {
    var sym;
    var count;
    if (results.success + results.failed === 0) {
      sym = '🤔';
      count = 'No tests ran';
    } else if (results.failed) {
      sym = '❌';
      s = results.success === 1 ? '' : 's'
      count = `${results.success} test${s} passed, ${results.failed} failed`;
    } else {
      sym = '✅';
      count = `${results.success} tests passed`;
    }

    var totalMs = browsers.map(b => b.lastResult.totalTime).reduce((x, y) => x + y);
    var totalSecs = Math.ceil(totalMs / 1000);
    var secs = totalSecs % 60;
    if (secs < 10) { secs = `0${secs}`; }
    var mins = Math.floor(totalSecs / 60);
    var time = `${mins}:${secs}`;

    notifier.notify({
      title: `${sym} Gusto-Karma`,
      message: `${count} in ${time}`
    });
  };
};
ToastReporter.$inject = ['baseReporterDecorator'];

module.exports = {'reporter:toast': ['type', ToastReporter]};
