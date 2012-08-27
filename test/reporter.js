var assert = require('assert'),
    async = require('async'),
    fs = require('fs'),
    reporter = require('../reporter'),
    db = require('../lib/db');

var contest_id = '12345';
var entriesFilename = '12345.entries.csv';

describe('seed data', function() {
  it('delete entries file', function(done) {
    fs.unlink(entriesFilename, done);
  });

  it('remove entries', function(done) {
    db.entries.remove(done);
  });

  it('load 100 entries', function(done) {
    var entries = [];
    for (var i = 0; i < 100; i ++) {
      entries.push({timestamp: new Date(), user_id: String(i), page_name: 'wat'});
    }
    async.forEach(entries, function(entry, cb) {
      db.entries.save(entry, cb)
    }, done);
  });
});

describe('run', function() {
  it('succeeds', function(done) {
    reporter.run(contest_id, done);
  });

  it('creates an entries file', function(done) {
    fs.stat(entriesFilename, function(err, stats) {
      assert(!err);
      assert(stats);
      done();
    });
  });

  it('the file has 100 lines', function(done) {
    fs.readFile(entriesFilename, 'utf8', function(err, data) {
      var lines = data.split('\n');
      // Ignore the empty string at the end resulting from the split
      assert.equal(lines.length-1, 100);
      done();
    });
  });
});
