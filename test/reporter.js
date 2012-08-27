var assert = require('assert'),
    async = require('async'),
    reporter = require('../reporter');

var contest_id = '12345';
describe('run', function() {
  it('succeeds', function(done) {
    reporter.run(contest_id, done);
  });
});
