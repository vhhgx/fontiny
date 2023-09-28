const path = require('path')

const basePath = path.join(__dirname, '..')

const formatterPath = function (key, options = []) {
  const pathEnum = {
    base: ['.'],
    font: ['..', 'fonts'],
    mini: ['..', 'minimized_fonts']
  }

  return path.join(basePath, ...pathEnum[key], ...options)
}

module.exports = {
  formatterPath
}