const { createMacro } = require('babel-plugin-macros')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const configXmlPath = path.join(__dirname, '../../../config.xml')

const $ = cheerio.load(fs.readFileSync(configXmlPath), { xmlMode: true })

const appVersion = $('widget').attr('version')

module.exports = createMacro(appVersionMacro)

function appVersionMacro({ references, state, babel }) {
  references.default.forEach(referencePath => {
    const functionCallPath = referencePath.parentPath
    const stringLiteralNode = babel.types.stringLiteral(appVersion)
    functionCallPath.replaceWith(stringLiteralNode)
  })
}
