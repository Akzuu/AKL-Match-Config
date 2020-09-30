const getConfig = require('./get-config');
const receiveConfig = require('./receive-config');
const getServerStatus = require('./get-server-status');
const removeConfig = require('./remove-config-by-match-id');

module.exports = {
  getConfig,
  receiveConfig,
  getServerStatus,
  removeConfig,
};
