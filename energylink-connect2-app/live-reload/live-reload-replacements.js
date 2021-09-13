/**
 * When you start this script:
 * Exposes cordova.js, cordova_plugins.js and plugins through webpack server public dir.
 * Updates android's config.xml file to use webpackserver on port 3000
 *
 * When you exit this script, it cleans all the replacements and removes all the files created.
 *
 */

// eslint-disable-next-line no-console
const log = console.log

const fs = require('fs')
const path = require('path')

const execa = require('execa')
const ip = require('ip')
const replace = require('replace-in-file')
const selected_platform = process.env.DEV_PLATFORM || 'android'
const host = process.env.DEV_HOST || ip.address()

const connect2Path = path.resolve('..')
const liveReloadPort = 3000

const ipAddressString = `http://${host}:${liveReloadPort}`
const pathIndexFile = connect2Path + '/energylink-connect2-app/src/index.jsx'
const beginning = '// Begin: This should never get committed'
const ending = '// Ending: above should never get committed\n'

const possiblePlatforms = [
  {
    platform: 'android',
    indexFilePath:
      connect2Path + '/platforms/android/app/src/main/res/xml/config.xml'
  },
  {
    platform: 'ios',
    indexFilePath:
      connect2Path + '/platforms/ios/SunPowerProConnect-dev/config.xml'
  }
]

let platform = possiblePlatforms.find(
  ({ platform }) => platform === selected_platform
)
const indexFilePath = platform.indexFilePath
try {
  if (!fs.existsSync(indexFilePath)) {
    console.error(
      `File didn't exist, make sure you run "cordova prepare ${selected_platform}". File: ${indexFilePath}`
    )
  }
} catch (err) {
  console.error(err)
}

const symlinks = []
function createSymlink(target, file) {
  symlinks.push(file)
  if (!fs.existsSync(target)) {
    console.error(
      `File didn't exist, make sure you run "cordova prepare ${selected_platform}". File: ${target}`
    )
  }

  try {
    fs.lstatSync(file)
    fs.unlinkSync(file)
  } catch (e) {
    log(file + ' didnt exist')
  } finally {
    fs.symlinkSync(target, file)
  }
}

function removeSymlinks() {
  symlinks.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  })
}

function makeReplacements(replacements) {
  const files = new Set()
  replacements.forEach(function(options) {
    const results = replace.sync(options)
    results.filter(r => r.hasChanged).forEach(r => files.add(r.file))
  })
  files.forEach(fileName => log(`Updated ${fileName}`))
}

function onExit() {
  log('\nClean up!')
  removeSymlinks()
  undoIndexFile()
  makeReplacements([
    {
      files: platform.indexFilePath,
      from: /<content src="[^"]*"\s+\/>/,
      to: `<content src="index.html" />`
    }
  ])
  process.exit()
}

function replaceIndexFile(proxyAddress) {
  const chunk = `
${beginning}
// eslint-disable-next-line import/order
import addProxyDecorator from './liveReloadDecorators'
addProxyDecorator('${proxyAddress}/')
${ending}`

  const content = fs.readFileSync(pathIndexFile).toString('UTF-8')
  if (-1 !== content.indexOf(beginning)) {
    return
  }

  const imports = content.match(/import\s[^\n]+/g)
  const importPos =
    content.lastIndexOf(imports[imports.length - 1]) +
    imports[imports.length - 1].length

  fs.writeFileSync(
    pathIndexFile,
    content.substring(0, importPos) + chunk + content.substring(importPos + 1)
  )
}

function undoIndexFile() {
  const content = fs.readFileSync(pathIndexFile).toString('UTF-8')
  const lastIndexBeginning = content.lastIndexOf(beginning)
  const lastIndexEnding = content.lastIndexOf(ending)
  if (lastIndexEnding !== -1) {
    const newContent =
      content.substring(0, lastIndexBeginning) +
      content.substring(lastIndexEnding + ending.length)

    fs.writeFileSync(pathIndexFile, newContent)
  }
}

async function canCommit(cb) {
  const response = await execa('git', ['diff', '--cached', pathIndexFile])
  if (response.stdout && response.stdout.lastIndexOf(ending) !== -1) {
    console.error(
      'You can not commit cause your src/index.jsx is dirty and staged. If you\'re running "npm run dev"' +
        ' try stopping it and make sure these changes are not staged for commit.'
    )
    return cb(1)
  }
  cb(0)
}

function onStart(proxyPort) {
  log('Replacing platform files to load at address: ' + ipAddressString)
  replaceIndexFile(`http://${host}:${proxyPort}`)
  makeReplacements([
    {
      files: platform.indexFilePath,
      from: /<content src="[^"]*"\s+\/>/,
      to: `<content src="${ipAddressString}" />`
    }
  ])

  if (selected_platform === 'android') {
    createSymlink(
      connect2Path + '/platforms/android/platform_www/cordova.js',
      connect2Path + '/energylink-connect2-app/public/cordova.js'
    )
    createSymlink(
      connect2Path + '/platforms/android/platform_www/cordova_plugins.js',
      connect2Path + '/energylink-connect2-app/public/cordova_plugins.js'
    )
    createSymlink(
      connect2Path + '/platforms/android/platform_www/plugins',
      connect2Path + '/energylink-connect2-app/public/plugins'
    )
  } else {
    createSymlink(
      connect2Path + '/platforms/ios/platform_www/cordova.js',
      connect2Path + '/energylink-connect2-app/public/cordova.js'
    )
    createSymlink(
      connect2Path + '/platforms/ios/platform_www/cordova_plugins.js',
      connect2Path + '/energylink-connect2-app/public/cordova_plugins.js'
    )
    createSymlink(
      connect2Path + '/platforms/ios/platform_www/plugins',
      connect2Path + '/energylink-connect2-app/public/plugins'
    )
  }
}

module.exports = {
  onStart,
  onExit,
  canCommit
}
