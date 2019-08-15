# node-desktop-app-settings
This npm module provides generic desktop application settings for Linux, Mac OS, and Windows. It runs synchronously for reading and writing. It automatically loads a settings JSON file on invocation and saves the file when node exits.

## Usage
Usage is fairly simple:

    let ndas = require('node-desktop-app-settings')
    
    let myConfig = ndas('MyProgramName')
    
    myConfig.settings.myOption = 123;

After this, whether from Ctrl-C, sigs, or regular closing of the program, the data file will be saved to `USERDATA/settings.json`.

### API

#### ndas(<String>)
The function returned by `require('node-desktop-app-settings')` returns a function that is used to create a desired settings.
  
##### Example
```
let ndas = require('node-desktop-app-settings')
let myConfig = ndas('MyProgram')
```
---
```
let myConfig = require('node-desktop-app-settings')('MyProgram')
````

#### config.settings
This property is the object that is saved on program exit.

#### config.appData
This property returns:

  * MacOS: /Users/user/Library/Preferences
  * Linux: /home/user/.local/share
  * Windows 8+: C:\Users\user\AppData\Roaming
  * Windows XP: C:\Documents and Settings\user\Application Data
  
**NOTE**: This uses the APPDATA or HOME environment variables along with some OS detection. See source for details.

#### config.userData
This property returns the appData path with the first argument passed to `ndas()`.

##### Example
```
let myConfig = require('node-desktop-app-settings')('MyProgram')

console.log(myConfig.userData) // returns appData + "/MyProgram"
```

#### config.settingsPath
This property returns the corresponding `settings.json` file path.

##### Example
```
let myConfig = require('node-desktop-app-settings')('MyProgram')

console.log(myConfig.settingsPath) // returns userData + "/settings.json"
```

#### config.save()
Saves the settings synchronously.

##### Example
```
myConfig.save()
```

#### config.clear()
Clears the current settings to an empty state.

##### Example
```
myConfig.close()
```