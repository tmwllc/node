var env = process.env.NODE_ENV || 'development',
	configFilename = env === 'development' ? 'dev' : 'prod';

module.exports = require('./config-' + configFilename + '.json');