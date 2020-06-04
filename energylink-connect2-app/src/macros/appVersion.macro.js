const { createMacro, MacroError } = require('babel-plugin-macros')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const configXmlPath = path.join(__dirname, '../../../config.xml')

function appVersionMacro({ references, babel }) {
  if (!fs.existsSync(configXmlPath)) {
    throw new MacroError(
      `Looked for "config.xml" in ${configXmlPath}, but didn't find it. App version data is read from it.`
    )
  }

  const $ = cheerio.load(fs.readFileSync(configXmlPath), { xmlMode: true })
  const appVersion = $('widget').attr('version')

  if (!appVersion) {
    throw new MacroError(
      'Cannot find app version data in "config.xml", check it contains the "version" attribute on the "widget" element.'
    )
  }

  references.default.forEach(referencePath => {
    const functionCallPath = referencePath.parentPath
    const stringLiteralNode = babel.types.stringLiteral(appVersion)
    functionCallPath.replaceWith(stringLiteralNode)
  })
}

module.exports = createMacro(appVersionMacro)
