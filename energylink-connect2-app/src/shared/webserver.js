import { compose, concat, curry, pathOr, replace } from 'ramda'
import { getLastIPOctet, isIos, padNumber } from 'shared/utils'

const defaultPort = 8080

export const getWebserverFirmwareUpgradePackageURL = (port = defaultPort) =>
  new Promise((resolve, reject) => {
    window.networkinterface.getWiFiIPAddress(wifi => {
      return resolve(
        `http://${wifi.ip}:${port}/luaFiles/fwup${padNumber(
          getLastIPOctet(wifi.ip)
        )}.lua`
      )
    }, reject)
  })

const getDataDirectory = pathOr('', ['cordova', 'file', 'dataDirectory'])

const removeFileProtocol = replace('file://', '')

const getAppRootIOS = compose(
  replace('Library/NoCloud/', 'Documents/'),
  removeFileProtocol,
  getDataDirectory
)

const getAppRootAndroid = curry(fileUrl => {
  const directory = compose(removeFileProtocol, getDataDirectory)(fileUrl)
  return concat(directory, 'files')
})

export const startWebserver = async (port = defaultPort) => {
  const wwwRoot = isIos() ? getAppRootIOS(window) : getAppRootAndroid(window)
  startServer(wwwRoot, port)
}

function startServer(wwwroot, port) {
  console.info('startServer', wwwroot)
  const httpd = pathOr(null, ['cordova', 'plugins', 'CorHttpd'], window)
  const serverSettings = {
    www_root: wwwroot,
    port: port,
    localhost_only: false
  }
  if (httpd) {
    console.info('httpd exists')
    // before start, check whether its up or not
    httpd.getURL(function(url) {
      console.info('url', url)
      if (url.length > 0) {
        console.info('base server', url)
        getWebserverFirmwareUpgradePackageURL()
      } else {
        /* wwwroot is the root dir of web server, it can be absolute or relative path
         * if a relative path is given, it will be relative to cordova assets/www/ in APK.
         * "", by default, it will point to cordova assets/www/, it's good to use 'htdocs' for 'www/htdocs'
         * if a absolute path is given, it will access file system.
         * "/", set the root dir as the www root, it maybe a security issue, but very powerful to browse all dir
         */

        httpd.startServer(
          serverSettings,
          function(url) {
            console.info('startServer url', url)
            // if server is up, it will return the url of http://<server ip>:port/
            // the ip is the active network connection
            // if no wifi or no cell, "127.0.0.1" will be returned.
            getWebserverFirmwareUpgradePackageURL()
          },
          function(error) {
            console.info('failed to start server: ' + error)
          }
        )
      }
    })
  } else {
    console.info('startServer - CorHttpd plugin not available/ready.')
  }
}

export function stopWebserver() {
  const httpd = pathOr(null, ['cordova', 'plugins', 'CorHttpd'], window)
  if (httpd) {
    // call this API to stop web server
    httpd.stopServer(
      function() {
        console.info('server is stopped.')
      },
      function(error) {
        console.info('failed to stop server' + error)
      }
    )
  } else {
    console.info('stopServer - CorHttpd plugin not available/ready.')
  }
}
