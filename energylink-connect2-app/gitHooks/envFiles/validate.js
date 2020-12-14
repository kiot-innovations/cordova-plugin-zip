const {
  any,
  compose,
  curry,
  difference,
  equals,
  filter,
  forEach,
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
const { checkEnvFilesExist } = require('./checkEnvFilesExist')
const {
  errorEnvKeysAreNotConsistent,
  errorEnvKeysDifference,
  errorEnvVarsValuesInconsistencies,
  errorFixDuplicatedKeys,
  errorFlavorMustDifferent,
  errorFlavorMustBeSet,
  errorMixpanelTokenMustBeDifferent,
  errorMixpanelTokenMustBeSet,
  errorMixpanelTokenMustBeTheSame,
  errorScanditLicensesMustBeDifferent,
  errorScanditLicensesMustBeSet,
  printDuplicatedKeys
} = require('./logging')
const { parseEnvFileWithKey } = require('./parseEnvFileWithKey')

// eslint-disable-next-line no-console
const log = console.log

/**
 * About app flavors:
 * 'test' is used mainly for development purposes.
 * 'uat', 'training' and 'prod' are all production flavors.
 * 'uat' is used for user acceptance testing by the QA team. It may use experimental features or services.
 * 'training' and 'prod', both target final users, only difference being the kind of user.
 */
const appEnvs = ['test', 'uat', 'training', 'prod']

// CHECK 1:
// All env files must be present.
checkEnvFilesExist(appEnvs)

// Read and decrypt all env files.
const decipherKey = process.env.CM2_ENVFILE_PASSWORD || ''
const parseEnvFile = parseEnvFileWithKey(decipherKey)
const allEnvConfigs = map(parseEnvFile, appEnvs)
const [testConfig, uatConfig, trainingConfig, prodConfig] = allEnvConfigs

// CHECK 2:
// Look for env files with duplicated keys in it.
const failBuild = () => process.exit(1)
const containsDuplicatedKeys = envConfig =>
  compose(not, isEmpty, prop('duplicatedKeys'))(envConfig)
const envConfigsWithDuplicatedKeys = filter(
  containsDuplicatedKeys,
  allEnvConfigs
)
const showDuplicatedKeysErrorMessage = !isEmpty(envConfigsWithDuplicatedKeys)

if (showDuplicatedKeysErrorMessage) {
  forEach(printDuplicatedKeys, envConfigsWithDuplicatedKeys)
  errorFixDuplicatedKeys()
  failBuild()
}

// Issues flags, these are used to fail the build.
let thereAreEnvKeysDifferences = false
let thereAreEnvKeysOrderInconsistencies = false
let thereIsAScanditLicenseIssue = false
let thereIsAMixpanelLicenseIssue = false
let thereAreEnvVarsValuesInconsistencies = false
let thereIsAFlavorIssue = false

// CHECK 3:
// 'test', 'uat', 'training' and 'prod' keys must be the same, except for the
// Scandit license keys.
const testKeys = keys(testConfig.config)
const uatKeys = keys(uatConfig.config)
const trainingKeys = keys(trainingConfig.config)
const prodKeys = keys(prodConfig.config)

const testKeysNotInProd = without(
  'REACT_APP_SCANDIT',
  difference(testKeys, prodKeys)
)
const prodKeysNotInTest = without(
  ['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'],
  difference(prodKeys, testKeys)
)
const uatKeysNotInProd = without(
  'REACT_APP_SCANDIT',
  difference(uatKeys, prodKeys)
)
const prodKeysNotInUat = without(
  ['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'],
  difference(prodKeys, uatKeys)
)
const trainingKeysNotInProd = without(
  'REACT_APP_SCANDIT',
  difference(trainingKeys, prodKeys)
)
const prodKeysNotInTraining = without(
  ['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'],
  difference(prodKeys, trainingKeys)
)

if (!isEmpty(testKeysNotInProd)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('test', 'prod', testKeysNotInProd)
}
if (!isEmpty(prodKeysNotInTest)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('prod', 'test', prodKeysNotInTest)
}
if (!isEmpty(uatKeysNotInProd)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('uat', 'prod', uatKeysNotInProd)
}
if (!isEmpty(prodKeysNotInUat)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('prod', 'uat', prodKeysNotInUat)
}
if (!isEmpty(trainingKeysNotInProd)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('training', 'prod', trainingKeysNotInProd)
}
if (!isEmpty(prodKeysNotInTraining)) {
  thereAreEnvKeysDifferences = true
  errorEnvKeysDifference('prod', 'training', prodKeysNotInTraining)
}
if (thereAreEnvKeysDifferences) {
  log('\n')
  failBuild()
}

// CHECK 4:
// 'test', 'uat', 'training' and 'prod' keys order must be the same.
const envsKeysAreNotConsistent = (aEnv, bEnv) => !equals(aEnv, bEnv)
if (
  envsKeysAreNotConsistent(
    without('REACT_APP_SCANDIT', testKeys),
    without(['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'], prodKeys)
  )
) {
  thereAreEnvKeysOrderInconsistencies = true
  errorEnvKeysAreNotConsistent('test', 'prod')
}
if (
  envsKeysAreNotConsistent(
    without('REACT_APP_SCANDIT', uatKeys),
    without(['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'], prodKeys)
  )
) {
  thereAreEnvKeysOrderInconsistencies = true
  errorEnvKeysAreNotConsistent('uat', 'prod')
}
if (
  envsKeysAreNotConsistent(
    without('REACT_APP_SCANDIT', trainingKeys),
    without(['REACT_APP_SCANDIT_ANDROID', 'REACT_APP_SCANDIT_IOS'], prodKeys)
  )
) {
  thereAreEnvKeysOrderInconsistencies = true
  errorEnvKeysAreNotConsistent('training', 'prod')
}
if (thereAreEnvKeysOrderInconsistencies) {
  log('\n')
  failBuild()
}

// CHECK 5:
// Scandit license must be set and be different across all app flavors.
// Regarding the prod flavor, license mut be different between iOS and
// Android, too.
const testScandit = propOr('', 'REACT_APP_SCANDIT', testConfig.config)
const uatScandit = propOr('', 'REACT_APP_SCANDIT', uatConfig.config)
const trainingScandit = propOr('', 'REACT_APP_SCANDIT', trainingConfig.config)
const prodScanditIos = propOr('', 'REACT_APP_SCANDIT_IOS', prodConfig.config)
const prodScanditAndroid = propOr(
  '',
  'REACT_APP_SCANDIT_ANDROID',
  prodConfig.config
)

if (
  any(isEmpty)([
    testScandit,
    uatScandit,
    trainingScandit,
    prodScanditIos,
    prodScanditAndroid
  ])
) {
  thereIsAScanditLicenseIssue = true
  errorScanditLicensesMustBeSet()
}
if (
  length(
    uniq([
      testScandit,
      uatScandit,
      trainingScandit,
      prodScanditIos,
      prodScanditAndroid
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

// CHECK 6:
// Mixpanel token must be the same in 'uat', 'training' and 'prod',
// Mixpanel token must be different for 'test'.
const testMixpanel = propOr('', 'REACT_APP_MIXPANEL_TOKEN', testConfig.config)
const uatMixpanel = propOr('', 'REACT_APP_MIXPANEL_TOKEN', uatConfig.config)
const trainingMixpanel = propOr(
  '',
  'REACT_APP_MIXPANEL_TOKEN',
  trainingConfig.config
)
const prodMixpanel = propOr('', 'REACT_APP_MIXPANEL_TOKEN', prodConfig.config)

if (any(isEmpty)([testMixpanel, uatMixpanel, trainingMixpanel, prodMixpanel])) {
  thereIsAMixpanelLicenseIssue = true
  errorMixpanelTokenMustBeSet()
}
if (
  length(uniq([testMixpanel, uatMixpanel, trainingMixpanel, prodMixpanel])) !==
  2
) {
  thereIsAMixpanelLicenseIssue = true
  errorMixpanelTokenMustBeDifferent()
}
if (length(uniq([uatMixpanel, trainingMixpanel, prodMixpanel])) !== 1) {
  thereIsAMixpanelLicenseIssue = true
  errorMixpanelTokenMustBeTheSame()
}
if (thereIsAMixpanelLicenseIssue) {
  log('\n')
  failBuild()
}

// CHECK 7:
// Flavor must be set and different for all environments
const testFlavor = propOr('', 'REACT_APP_FLAVOR', testConfig.config)
const uatFlavor = propOr('', 'REACT_APP_FLAVOR', uatConfig.config)
const trainingFlavor = propOr('', 'REACT_APP_FLAVOR', trainingConfig.config)
const prodFlavor = propOr('', 'REACT_APP_FLAVOR', prodConfig.config)

if (any(isEmpty)([testFlavor, uatFlavor, trainingFlavor, prodFlavor])) {
  thereIsAFlavorIssue = true
  errorFlavorMustBeSet()
}
if (length(uniq([testFlavor, uatFlavor, trainingFlavor, prodFlavor])) !== 4) {
  thereIsAFlavorIssue = true
  errorFlavorMustDifferent()
}
if (thereIsAFlavorIssue) {
  log('\n')
  failBuild()
}

// CHECK 8 :
// Check all the env vars that must have the same value across all flavors.
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
  testConfig.config,
  uatConfig.config,
  trainingConfig.config,
  prodConfig.config
])
const envVarsWithValueInconsistency = compose(
  pluck('envVar'),
  filter(propEq('hasSameValue', false))
)
const allEnvsSameValueVars = [
  'REACT_APP_DEFAULT_DEBOUNCE',
  'REACT_APP_DEFAULT_PARTNER_ID',
  'REACT_APP_ESS_DOWNLOAD_URL',
  'REACT_APP_GRID_PROFILE_UPLOAD_ENDPOINT',
  'REACT_APP_IS_MOBILE',
  'REACT_APP_LATEST_FIRMWARE_URL',
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
if (thereAreEnvVarsValuesInconsistencies) {
  log('\n')
  failBuild()
}
