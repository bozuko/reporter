var config = require('../config');
var db = require('mongojs').connect(config.db.host+'/'+config.db.name, [
  'entries', 'plays', 'users', 'contests'
]);

module.exports = db;
