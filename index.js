const fs      = require('fs')
const path    = require('path')

function NDAS(appName, options) {
  options = Object.assign({
    saveOn: [
      'exit',
      'SIGINT',
      'uncaughtException',
    ],
  }, options)

  this.appData         = options.appData || (process.env.APPDATA || (process.platform == 'darwin' ? path.join(process.env.HOME, 'Library/Preferences') : path.join(process.env.HOME, "/.local/share")))
  this.userData        = options.userData || path.join(this.appData, appName)
  this.settingsPath    = options.settingsPath || path.join(this.userData, 'settings.json')
  try {
    this.settings = JSON.parse(fs.readFileSync(this.settingsPath, { encoding: 'utf8' }))
  } catch (e) {
    this.settings = {}
  }

  // Add process hooks
  function exitFunc(options, exitCode) {
    if (options.cleanup) {
      this.save()
    }
    if (options.exit) {
      process.exit()
    }
  }
  
  if (options.saveOn['exit']) {
    process.on('exit', exitFunc.bind(this, {cleanup: true}))
  }
  if (options.saveOn['SIGINT']) {
    process.on('SIGINT', exitFunc.bind(this, {exit: true}))
  }
  if (options.saveOn['uncaughtException']) {
    process.on('uncaughtException', exitFunc.bind(this, {exit: true}))
  }
}

NDAS.prototype.save = function() {
  fs.mkdirSync(this.userData, { recursive: true, mode: 0o755 })
  fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings))
}

NDAS.prototype.clear = function() {
  this.settings = {}
}

module.exports = function(appName, options) {
  return new NDAS(appName, options)
}
