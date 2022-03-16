import { compose, concat, curry, pathOr, replace } from 'ramda'
import * as Sentry from 'sentry-cordova'

import { flipConcat, getLastIPOctet, isIos, padNumber } from 'shared/utils'

const defaultPort = 8080

const getLuaFullPath = curry((ipAddress, port, isPvs5) => {
  const getLuaFileName = compose(padNumber, getLastIPOctet)
  const baseUrl = `http://${ipAddress}:${port}/${
    isPvs5 ? 'pvs5-luaFiles/' : 'luaFiles/'
  }`
  const luaFileName = `fwup${getLuaFileName(ipAddress)}.lua`
  return concat(baseUrl, luaFileName)
})

export const getFirmwareUpgradePackageURL = (isPvs5, port = defaultPort) =>
  new Promise((resolve, reject) => {
    window.networkinterface.getWiFiIPAddress(
      ({ ip }) => resolve(getLuaFullPath(ip, port, isPvs5)),
      reject
    )
  })

const getDataDirectory = pathOr('', ['cordova', 'file', 'dataDirectory'])

const removeFileProtocol = replace('file://', '')

const getAppRootIOS = compose(
  replace('Library/NoCloud/', 'Documents/'),
  removeFileProtocol,
  getDataDirectory
)

const getAppRootAndroid = compose(
  flipConcat('files'),
  removeFileProtocol,
  getDataDirectory
)

export const startWebserver = async (port = defaultPort) => {
  const wwwRoot = isIos() ? getAppRootIOS(window) : getAppRootAndroid(window)
  startServer(wwwRoot, port)
}

function startServer(wwwroot, port) {
  const httpd = pathOr(null, ['cordova', 'plugins', 'CorHttpd'], window)
  const serverSettings = {
    www_root: wwwroot,
    port: port,
    localhost_only: false
  }
  if (httpd) {
    httpd.getURL(function(url) {
      if (url.length === 0) {
        httpd.startServer(serverSettings, console.info, Sentry.captureException)
      }
    })
  } else {
    Sentry.captureMessage('startServer - CorHttpd plugin not available/ready.')
  }
}

export function stopWebserver() {
  const httpd = pathOr(null, ['cordova', 'plugins', 'CorHttpd'], window)
  if (httpd) {
    // call this API to stop web server
    httpd.stopServer(function() {
      console.info('server is stopped.')
    }, Sentry.captureException)
  } else {
    Sentry.captureMessage('stopServer - CorHttpd plugin not available/ready.')
  }
}
