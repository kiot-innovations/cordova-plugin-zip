const { assoc, curry } = require('ramda')
const { decipherEnvFile } = require('./decipherEnvFile')
const { parse } = require('./parse')

const parseEnvFileWithKey = (decipherKey, appEnv) => {
  const envFile = decipherEnvFile(decipherKey, appEnv)
  const parsedEnvFile = parse(envFile)
  const config = assoc('env', appEnv, parsedEnvFile)

  return config
}

exports.parseEnvFileWithKey = curry(parseEnvFileWithKey)
