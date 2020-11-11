/**
 * Live-Reload proxy to by-pass CORs issues
 */

/* eslint-disable no-console */

const cors_proxy = require('cors-anywhere')
const replacements = require('./live-reload-replacements')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080

cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
  })
  .listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port)
  })

replacements.onStart(port)
process.on('SIGINT', replacements.onExit)
