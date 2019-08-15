const fs      = require('fs')
const path    = require('path')

module.exports = function(appName) {
  let appData         = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share")
  let userData        = path.join(appData, appName)
  let settingsPath    = path.join(userData, 'settings.json')
  let settings    = {}

  // I would prefer async, but I don't think it really matters.
  // Create our userData directory.
  fs.mkdirSync(userData, { recursive: true, mode: 0o640 })
  // Read our settings file.
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, { encoding: 'utf8' }))
  } catch (e) {
    if (e.code === 'ENOENT') {
      settings = {}
    } else {
      throw e
    }
  }

  function save() {
    fs.writeFileSync(settingsPath, JSON.stringify(settings))
  }

  function clear() {
    settings = {}
  }

  // Add process hooks
  function exitFunc(options, exitCode) {
    if (options.cleanup) {
      save()
    }
    if (options.exit) {
      process.exit()
    }
  }
  
  process.on('exit', exitFunc.bind(null, {cleanup: true}))
  process.on('SIGINT', exitFunc.bind(null, {exit: true}))
  process.on('SIGUSR1', exitFunc.bind(null, {exit: true}))
  process.on('SIGUSR2', exitFunc.bind(null, {exit: true}))
  process.on('uncaughtException', exitFunc.bind(null, {exit: true}))

  return {
    appData: appData,
    userData: userData,
    settingsPath: settingsPath,
    settings: settings,
    clear: clear,
    save: save
  }
}
