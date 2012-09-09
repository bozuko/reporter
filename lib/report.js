var async = require('async'),
    fs = require('fs');

var Report = module.exports = function() {
}

Report.prototype.run = function(callback) {
  var self = this;
  var done = false;
  var stream = this.stream = fs.createWriteStream(this.filename, {flags: 'a'});
  async.whilst(
    function() {
      return !done;
    },
    function(cb) {
      self.runBatch(function(err, _done) {
        if (err) return cb(err);
        if (_done) done = true;
        cb();
      });
    },
    function(err) {
      stream.end();
      callback(err);
    }
  );
};

// NOTE: This algorithm assumes that one line of the csv is no larger than the block size
// of the file. Thie is most commonly 4096 bytes.
Report.prototype.initFile = function(callback) {
  var self = this;
  fs.exists(self.filename, function(exists) {
    if (!exists) return callback();
    async.waterfall([
      function(cb) {
        fs.stat(self.filename, cb);
      },
      function(stats, cb) {
        readLastBlock(self.filename, stats, cb);
      },
      function(filesize, block, cb) {
        truncateToLastLine(self.filename, filesize, block, cb);
      }
    ], callback);
  });
};

function readLastBlock(filename, stats, callback) {
  if (stats.size < stats.blksize) {
    return fs.readFile(filename, 'utf8', function(err, block) {
      return callback(null, stats.size,  block);
    });
  }
  
  var pos = stats.size - stats.blksize;
  var file = fs.createReadStream(filename, {start: pos, encoding: 'utf8'});
  var _err = null
  var block = '';
  file.on('data', function(str) {
    block += str;
  });
  file.on('error', function(err) {
    _err = err;
    file.destroy();
    callback(err);
  });
  file.on('end', function() {
    if (!_err) {
      file.destroy();
      callback(null, stats.size, block);
    }
  });
}

function truncateToLastLine(filename, filesize, block, callback) {
  var index = block.lastIndexOf('\n') + 1;
  var charsToDelete = block.length - index;
  var len = filesize - charsToDelete;
  fs.open(filename, 'r+', function(err, fd) {
    if (err) return callback(err);
    fs.truncate(fd, len, function(err) {
      if (err) return callback(err);
      fs.close(fd, callback);
    });
  });
}

Report.prototype.append = function(str, callback) {
  this.stream.once('drain', callback);
  this.stream.write(str);
};
