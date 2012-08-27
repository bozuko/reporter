var fs = require('fs'),
    async = require('async');

var reports = [];
fs.readdirSync(__dirname+'/lib/reports').forEach(function(file) {
  if (file.match(/.+\.js$/)) {
    var Report = require('./lib/reports/'+file);
    reports.push(Report);
  }
});

var reporter = module.exports = {};

reporter.run = function(contest, callback) {
  async.forEach(reports, function(Report, cb) {
    var report = new Report(contest);
    report.run(cb);
  }, callback);
};
