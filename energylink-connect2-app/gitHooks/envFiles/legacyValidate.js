const {
  compose,
  concat,
  curry,
  difference,
  equals,
  filter,
  forEach,
  head,
  isEmpty,
  keys,
  length,
  map,
  not,
  pluck,
  prop,
  propEq,
  propOr,
  uniq,
  without
} = require('ramda')
// eslint-disable-next-line no-console
const log = console.log

const { checkEnvFilesExist } = require('./checkEnvFilesExist')
const { parseEnvFileWithKey } = require('./parseEnvFileWithKey')
const {
  errorMissingDecipherKey,
  errorFixDuplicatedKeys,
  errorEnvKeysDifference,
  errorEnvKeysAreNotConsistent,
  errorScanditLicenseMustBeDifferent,
  errorPlatformsScanditLicenseMustBeEqual,
  errorPlatformsScanditLicenseMustBeDifferent,
  errorScanditLicensesMustBeDifferent,
  errorEnvVarsValuesInconsistencies,
  printDuplicatedKeys
} = require('./logging')

const appEnvs = ['uat', 'test', 'training', 'prod']
const decipherKey = process.env.CM2_ENVFILE_PASSWORD || ''
const failBuild = () => process.exit(1)
const parseEnvFile = parseEnvFileWithKey(decipherKey)
const containsDuplicatedKeys = envConfig =>
  compose(not, isEmpty, prop('duplicatedKeys'))(envConfig)
const getConfig = curry((envConfigs, appEnv) =>
  compose(prop('config'), head, filter(propEq('env', appEnv)))(envConfigs)
)
const envsKeysAreNotConsistent = (aEnv, bEnv) => !equals(aEnv, bEnv)

if (isEmpty(decipherKey)) {
  errorMissingDecipherKey()
  failBuild()
}

checkEnvFilesExist(appEnvs)

const envConfigs = map(parseEnvFile, appEnvs)
const getEnvConfig = getConfig(envConfigs)
const envConfigsWithDuplicatedKeys = filter(containsDuplicatedKeys, envConfigs)
const showDuplicatedKeysErrorMessage = !isEmpty(envConfigsWithDuplicatedKeys)

if (showDuplicatedKeysErrorMessage) {
  forEach(printDuplicatedKeys, envConfigsWithDuplicatedKeys)
  errorFixDuplicatedKeys()
  failBuild()
}

// Envs 'uat', 'training' and 'prod' should contain the same keys.
// except for REACT_APP_SCANDIT_ANDROID, REACT_APP_SCANDIT_IOS and REACT_APP_SCANDIT.

const devConfig = getEnvConfig('dev')
const testConfig = getEnvConfig('test')
const trainingConfig = getEnvConfig('training')
const prodConfig = getEnvConfig('prod')
const devKeys = without('REACT_APP_IS_DEV', keys(devConfig))
const testKeys = without('REACT_APP_IS_TEST', keys(testConfig))
const trainingKeys = keys(trainingConfig)
const prodKeys = keys(prodConfig)
const devKeysNotInTest = difference(devKeys, testKeys)
const testKeysNotInDev = difference(testKeys, devKeys)
const trainingKeysNotInProd = difference(trainingKeys, prodKeys)
const prodKeysNotInTraining = difference(prodKeys, trainingKeys)
let thereAreEnvKeysDifferences = false
let thereAreEnvKeysInconsistencies = false
let thereIsAScanditLicenseIssue = false
let thereAreEnvVarsValuesInconsistencies = false
// REACT_APP_SCANDIT is splitted into REACT_APP_SCANDIT_ANDROID and
// REACT_APP_SCANDIT_IOS for 'training' and 'prod'.
const testKeysNotInTraining = without(
  'REACT_APP_SCANDIT',
  difference(testKeys, trainingKeys)
)
const trainingKeysNotInTest = without(
  ['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'],
  difference(trainingKeys, testKeys)
)

if (!isEmpty(devKeysNotInTest)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('dev', 'test', devKeysNotInTest)
}
if (!isEmpty(testKeysNotInDev)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('test', 'dev', testKeysNotInDev)
}
if (!isEmpty(trainingKeysNotInProd)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('training', 'prod', trainingKeysNotInProd)
}
if (!isEmpty(prodKeysNotInTraining)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('prod', 'training', prodKeysNotInTraining)
}
if (!isEmpty(testKeysNotInTraining)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('test', 'training', testKeysNotInTraining)
}
if (!isEmpty(trainingKeysNotInTest)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('training', 'test', trainingKeysNotInTest)
}
if (thereAreEnvKeysDifferences) {
  log('\n')
  failBuild()
}

// Envs 'dev' and 'test' keys must be in the same order.
// Envs 'training' and 'prod' keys must be in the same order.
// Envs 'test' and 'training' keys must be in the same order.
if (envsKeysAreNotConsistent(devKeys, testKeys)) {
  thereAreEnvKeysInconsistencies = true
  errorEnvKeysAreNotConsistent('dev', 'test')
}
if (envsKeysAreNotConsistent(trainingKeys, prodKeys)) {
  thereAreEnvKeysInconsistencies = true
  errorEnvKeysAreNotConsistent('training', 'prod')
}
if (
  envsKeysAreNotConsistent(
    without('REACT_APP_SCANDIT', testKeys),
    without(
      ['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'],
      trainingKeys
    )
  )
) {
  thereAreEnvKeysInconsistencies = true
  errorEnvKeysAreNotConsistent('test', 'training')
}
if (thereAreEnvKeysInconsistencies) {
  log('\n')
  failBuild()
}

// Scandit licence must be set and have different value between 'dev' and 'test'.
// Scandit licence must be set and have same value between platforms in 'training'.
// Scandit licence must be set and have different value between platforms in 'prod'.
// Scandit licence must have different value between 'dev', 'test', 'training' and 'prod'.
const devScandit = propOr('', 'REACT_APP_SCANDIT', devConfig)
const testScandit = propOr('', 'REACT_APP_SCANDIT', testConfig)
const trainingScanditAndroid = propOr(
  '',
  'REACT_APP_SCANDIT_ANDROID',
  trainingConfig
)
const trainingScanditIos = propOr('', 'REACT_APP_SCANDIT_IOS', trainingConfig)
const prodScanditAndroid = propOr('', 'REACT_APP_SCANDIT_ANDROID', prodConfig)
const prodScanditIos = propOr('', 'REACT_APP_SCANDIT_IOS', prodConfig)

if (
  isEmpty(devScandit) ||
  isEmpty(testScandit) ||
  equals(devScandit, testScandit)
) {
  thereIsAScanditLicenseIssue = true
  errorScanditLicenseMustBeDifferent('dev', 'test')
}
if (
  isEmpty(trainingScanditAndroid) ||
  isEmpty(trainingScanditIos) ||
  !equals(trainingScanditAndroid, trainingScanditIos)
) {
  thereIsAScanditLicenseIssue = true
  errorPlatformsScanditLicenseMustBeEqual('training')
}
if (
  isEmpty(prodScanditAndroid) ||
  isEmpty(prodScanditIos) ||
  equals(prodScanditAndroid, prodScanditIos)
) {
  thereIsAScanditLicenseIssue = true
  errorPlatformsScanditLicenseMustBeDifferent('prod')
}
// Only training platforms have same license
if (
  length(
    uniq([
      devScandit,
      testScandit,
      trainingScanditAndroid,
      trainingScanditIos,
      prodScanditAndroid,
      prodScanditIos
    ])
  ) !== 5
) {
  thereIsAScanditLicenseIssue = true
  errorScanditLicensesMustBeDifferent()
}
if (thereIsAScanditLicenseIssue) {
  log('\n')
  failBuild()
}

// Other env vars values consistency checks
const hasSameValueInEnvs = curry((envConfigs, envVar) => {
  const getValue = propOr('', envVar)
  const values = map(getValue, envConfigs)
  const hasSameValue = compose(equals(1), length, uniq)

  return {
    envVar: envVar,
    hasSameValue: hasSameValue(values)
  }
})
const hasSameValueInAllEnvs = hasSameValueInEnvs([
  devConfig,
  testConfig,
  trainingConfig,
  prodConfig
])
const hasSameValueInDevTest = hasSameValueInEnvs([devConfig, testConfig])
const hasSameValueInTrainingProd = hasSameValueInEnvs([
  trainingConfig,
  prodConfig
])
const envVarsWithValueInconsistency = compose(
  pluck('envVar'),
  filter(propEq('hasSameValue', false))
)

// Env vars values inconsistencies across all envs
const allEnvsSameValueVars = [
  'REACT_APP_DEFAULT_DEBOUNCE',
  'REACT_APP_GRID_PROFILE_UPLOAD_ENDPOINT',
  'REACT_APP_IS_MOBILE',
  'REACT_APP_MAPS_API_KEY',
  'REACT_APP_PING_AC_CLIENT',
  'REACT_APP_PING_ENVIRONMENT',
  'REACT_APP_PING_REDIRECT_URI',
  'REACT_APP_PVS_ADDRESS',
  'REACT_APP_PVS_SELECTEDADDRESS',
  'REACT_APP_PVS_WS',
  'REACT_APP_SENTRY_DSN',
  'REACT_APP_WIFIKEY',
  'SKIP_PREFLIGHT_CHECK'
]
const sameValueAllEnvsMap = map(hasSameValueInAllEnvs, allEnvsSameValueVars)
const sameValueAllEnvsInconsistencies = envVarsWithValueInconsistency(
  sameValueAllEnvsMap
)
if (!isEmpty(sameValueAllEnvsInconsistencies)) {
  thereAreEnvVarsValuesInconsistencies = true
  errorEnvVarsValuesInconsistencies(appEnvs, sameValueAllEnvsInconsistencies)
}
// Env vars values inconsistencies across 'dev' and 'test' envs
const devTestDifferentValueVars = [
  'REACT_APP_IS_DEV',
  'REACT_APP_IS_TEST',
  'REACT_APP_HARDWARE_URLS',
  'REACT_APP_SCANDIT',
  'REACT_APP_APPLE_ID',
  'REACT_APP_ANDROID_ID',
  'REACT_APP_MIXPANEL_TOKEN'
]
const devTestSameValueVars = compose(
  without(devTestDifferentValueVars),
  uniq,
  concat
)(keys(devConfig), keys(testConfig))
const sameValueDevTestMap = map(hasSameValueInDevTest, devTestSameValueVars)
const sameValueDevTestInconsistencies = envVarsWithValueInconsistency(
  sameValueDevTestMap
)
if (!isEmpty(sameValueDevTestInconsistencies)) {
  thereAreEnvVarsValuesInconsistencies = true
  errorEnvVarsValuesInconsistencies(
    ['dev', 'test'],
    sameValueDevTestInconsistencies
  )
}
// Env vars values inconsistencies across 'training' and 'prod' envs
const trainingProdDifferentValueVars = [
  'REACT_APP_SCANDIT_ANDROID',
  'REACT_APP_SCANDIT_IOS',
  'REACT_APP_APPLE_ID',
  'REACT_APP_ANDROID_ID',
  'REACT_APP_HARDWARE_URLS',
  'REACT_APP_MIXPANEL_TOKEN'
]
const trainingProdSameValueVars = compose(
  without(trainingProdDifferentValueVars),
  uniq,
  concat
)(keys(trainingConfig), keys(prodConfig))
const sameValueTrainingProdMap = map(
  hasSameValueInTrainingProd,
  trainingProdSameValueVars
)
const sameValueTrainingProdInconsistencies = envVarsWithValueInconsistency(
  sameValueTrainingProdMap
)
if (!isEmpty(sameValueTrainingProdInconsistencies)) {
  thereAreEnvVarsValuesInconsistencies = true
  errorEnvVarsValuesInconsistencies(
    ['training', 'prod'],
    sameValueTrainingProdInconsistencies
  )
}
if (thereAreEnvVarsValuesInconsistencies) {
  log('\n')
  failBuild()
}
