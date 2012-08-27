var util = require('util'),
    async = require('async'),
    Report = require('../report'),
    db = require('../db');

var EntriesReport = module.exports = function(contest) {
  this.contest = contest;
  this.filename = contest+'.'+'entries.csv';
  this.lastEntryId = null;
  this.batchSize = 1000;
}

util.inherits(EntriesReport, Report);

EntriesReport.prototype.runBatch = function(callback) {
  var self = this;
  async.waterfall([
    function(cb) {
      self.getEntries(cb);
    },
    function(entries, cb) {
      self.format(entries, cb);
    },
    function(str, done, cb) {
      self.append(str, function(err) {
        cb(err, done);
      });
    }
  ], callback);
};

EntriesReport.prototype.getEntries = function(callback) {
  var query = {};
  if (this.lastEntryId) {
    query = {_id: {$gt: this.lastEntryId}};
  }
  db.entries.find(query).limit(this.batchSize, callback);
};

EntriesReport.prototype.format = function(entries, callback) {
  var str = '';
  var done = false;
  if (!entries.length) return callback(null, str, true);

  entries.forEach(function(entry) {
    str += entry.timestamp.toISOString()+','+entry.user_id+','+entry.page_name+"\n"
  });
  this.lastEntryId = entries[entries.length - 1]._id;
  if (entries.length < this.batchSize) {
    done = true;
  }
  return callback(null, str, done);
};
