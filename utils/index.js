const commom = require('../utils/common')

module.exports = {
  fs: require('fs').promises,
  path: require('path'),
  standardPath: commom.standardPath,
  writeLogs: commom.writeLogs,
}
