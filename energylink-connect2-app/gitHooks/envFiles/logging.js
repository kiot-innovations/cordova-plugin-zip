const { forEachObjIndexed, join, map, props } = require('ramda')
const chalk = require('chalk')
// eslint-disable-next-line no-console
const log = console.log

const errorMissingDecipherKey = () =>
  log(chalk`{red Error: {white.dim CM2_ENVFILE_PASSWORD} environment variable isn't set.}\n
{white You must set the {dim CM2_ENVFILE_PASSWORD} env variable in {dim .zshrc} or {dim .bashrc} file,
or any other way you use to set environment variables.\n
If you don't have the decrypt key for the environment ({dim .env.enc.* }) files,
ask any other developer in the project for it.}\n`)

const errorDuplicatedKey = (times, key) =>
  log(chalk`{red Key {white.dim ${key}} appears {white.dim ${times}} times.}`)

const errorFixDuplicatedKeys = () =>
  log(chalk`{red Please choose the correct value!\n}`)

const printDuplicatedKeys = envConfig => {
  const [env, duplicatedKeys] = props(['env', 'duplicatedKeys'], envConfig)

  log(chalk`{white Duplicated keys found in {dim .env.enc.${env}}}:`)
  forEachObjIndexed(errorDuplicatedKey, duplicatedKeys)
  log(`\n`)
}

const errorEnvKeysDifference = (aEnv, bEnv, difference) =>
  log(
    chalk`{red Error: {white.dim .env.enc.${aEnv}} contains some keys {white.dim .env.enc.${bEnv}} doesn't: {white.dim ${join(
      ', ',
      difference
    )}}}`
  )

const errorEnvKeysAreNotConsistent = (aEnv, bEnv) =>
  log(
    chalk`{red Error: {white.dim .env.enc.${aEnv}} keys and {white.dim .env.enc.${bEnv}} keys are in different order.}`
  )

const errorScanditLicenseMustBeDifferent = (aEnv, bEnv) =>
  log(
    chalk`{red Error: Scandit license in {white.dim .env.enc.${aEnv}} and {white.dim .env.enc.${bEnv}} must be set and have different value.}`
  )

const errorPlatformsScanditLicenseMustBeEqual = env =>
  log(
    chalk`{red Error: Scandit license for Android and iOS in {white.dim .env.enc.${env}} must be set and have equal value.}`
  )

const errorPlatformsScanditLicenseMustBeDifferent = env =>
  log(
    chalk`{red Error: Scandit license for Android and iOS in {white.dim .env.enc.${env}} must be set and have different value.}`
  )

const errorScanditLicensesMustBeDifferent = () =>
  log(
    chalk`{red Error: Scandit licenses must be different between environments.}`
  )

const errorScanditLicensesMustBeSet = () =>
  log(chalk`{red Error: Scandit licenses must be set for all environments.}`)

const errorMixpanelTokenMustBeSet = () =>
  log(chalk`{red Error: Mixpanel token must be set for all environments.}`)

const errorMixpanelTokenMustBeDifferent = () =>
  log(
    chalk`{red Error: Mixpanel token for 'test' must be different than in 'uat', 'training' and 'prod'.}`
  )

const errorMixpanelTokenMustBeTheSame = () =>
  log(
    chalk`{red Error: Mixpanel token must be the same for 'uat', 'training' and 'prod'.}`
  )

const errorFlavorMustBeSet = () =>
  log(chalk`{red Error: App flavor must be set for all environments.}`)

const errorFlavorMustDifferent = () =>
  log(chalk`{red Error: App flavor must be different for all environments.}`)

const errorEnvVarsValuesInconsistencies = (envs, envVars) => {
  const envFile = env => `.env.enc.${env}`
  const envFiles = map(envFile, envs)

  return log(
    chalk`{red Error: The environment vars {white.dim ${join(
      ', ',
      envVars
    )}} in {white.dim ${join(', ', envFiles)}} must have the same value.}`
  )
}

exports.errorMissingDecipherKey = errorMissingDecipherKey
exports.printDuplicatedKeys = printDuplicatedKeys
exports.errorFixDuplicatedKeys = errorFixDuplicatedKeys
exports.errorEnvKeysDifference = errorEnvKeysDifference
exports.errorEnvKeysAreNotConsistent = errorEnvKeysAreNotConsistent
exports.errorScanditLicenseMustBeDifferent = errorScanditLicenseMustBeDifferent
exports.errorPlatformsScanditLicenseMustBeEqual = errorPlatformsScanditLicenseMustBeEqual
exports.errorPlatformsScanditLicenseMustBeDifferent = errorPlatformsScanditLicenseMustBeDifferent
exports.errorScanditLicensesMustBeDifferent = errorScanditLicensesMustBeDifferent
exports.errorScanditLicensesMustBeSet = errorScanditLicensesMustBeSet
exports.errorMixpanelTokenMustBeSet = errorMixpanelTokenMustBeSet
exports.errorMixpanelTokenMustBeDifferent = errorMixpanelTokenMustBeDifferent
exports.errorMixpanelTokenMustBeTheSame = errorMixpanelTokenMustBeTheSame
exports.errorFlavorMustBeSet = errorFlavorMustBeSet
exports.errorFlavorMustDifferent = errorFlavorMustDifferent
exports.errorEnvVarsValuesInconsistencies = errorEnvVarsValuesInconsistencies
