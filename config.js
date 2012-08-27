var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    db: {
      name: 'bozuko_development',
      host: '127.0.0.1',
      port: 27017
    }
  }
}

module.exports = config[env];
