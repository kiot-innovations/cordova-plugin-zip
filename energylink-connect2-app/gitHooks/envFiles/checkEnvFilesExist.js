const fs = require('fs')
const path = require('path')
const { difference, filter, forEach, isEmpty } = require('ramda')
const chalk = require('chalk')
// eslint-disable-next-line no-console
const log = console.log

const envFileExists = appEnv =>
  fs.existsSync(path.join(__dirname, `../../.env.enc.${appEnv}`))

const initMessage = () =>
  log(chalk`{white Checking all the encrypted environment files exist...\n}`)
const successEnvFileMessage = appEnv =>
  log(chalk`{white {green [OK]} {dim .env.enc.${appEnv}} exists!}`)
const errorMissingEnvFileMessage = appEnv =>
  log(chalk`{white {red [KO]} {dim .env.enc.${appEnv}} is missing!}`)

const checkEnvFilesExist = appEnvs => {
  const existingEnvFiles = filter(envFileExists, appEnvs)
  const missingEnvFiles = difference(appEnvs, existingEnvFiles)

  initMessage()
  forEach(successEnvFileMessage, existingEnvFiles)

  if (isEmpty(missingEnvFiles)) {
    log(chalk`{green \nAll encrypted environment files exist!}\n`)
  } else {
    forEach(errorMissingEnvFileMessage, missingEnvFiles)
    log(
      chalk`{red \nError: Check the missing encrypted environment files above!\n}`
    )
    process.exit(1)
  }
}

exports.checkEnvFilesExist = checkEnvFilesExist
