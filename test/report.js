var assert = require('assert'),
    async = require('async'),
    fs = require('fs'),
    Report = require('../lib/report');

var filename = './testFile.txt';

describe('initialize file', function() {
  var report = new Report();
  report.filename = filename;

  it('should initially not exist', function() {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    };
  });

  it('calling initFile should not fail on an empty file', function(done) {
    report.initFile(function(err) {
      assert(!err);
      done();
    });
  });

  it('create a test file with one good line, and one partial line', function() {
    fs.writeFileSync(filename,
      'one good line\n' +
      'one partial line'
    );
  });

  it('call initFile on the file with a bad line', function(done) {
    report.initFile(function(err) {
      assert(!err);
      done();
    });
  });

  it('read the file in and ensure it is correctly truncated', function() {
    var data = fs.readFileSync(filename, 'utf8');
    assert.deepEqual(data, 'one good line\n');
  });
});
