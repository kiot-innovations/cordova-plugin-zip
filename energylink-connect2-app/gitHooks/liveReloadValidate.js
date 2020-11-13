/**
 * Validates whether the hacks we need for live-reload are present in src/index.jsx
 * If they are it exits with code 1
 */
const { canCommit } = require('../live-reload/live-reload-replacements')

// eslint-disable-next-line no-console
const log = console.log
log('Cleaning live-reload')

canCommit(exitCode => process.exit(exitCode))
