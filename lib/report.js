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

Report.prototype.append = function(str, callback) {
  this.stream.once('drain', callback);
  this.stream.write(str);
};
