const SentryCli = require('@sentry/cli')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const configXmlPath = path.join(__dirname, '../config.xml')

const getAppVersion = () => {
  if (!fs.existsSync(configXmlPath)) {
    throw new Error(
      `Looked for "config.xml" in ${configXmlPath}, but didn't find it.`
    )
  }
  const $ = cheerio.load(fs.readFileSync(configXmlPath), { xmlMode: true })
  return $('widget').attr('version')
}

async function createReleaseAndUpload() {
  const release = getAppVersion()
  console.info({ release }, 'CURRENT RELEASE')
  if (!release) {
    console.warn('REACT_APP_SENTRY_RELEASE is not set')
    return
  }
  const cli = new SentryCli()
  try {
    console.info('Creating sentry release ' + release)
    await cli.releases.new(release)
    console.info('Uploading source maps')
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false
    })
    console.info('Finalizing release')
    await cli.releases.finalize(release)
  } catch (e) {
    console.error('Source maps uploading failed:', e)
    throw e
  }
}
createReleaseAndUpload()
  .then(() => console.info('Source maps uploaded to Sentry'))
  .catch(console.error)
