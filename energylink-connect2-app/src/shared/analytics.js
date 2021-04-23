import appVersion from '../macros/appVersion.macro'
import { capitalizeWord, getUserProfile } from 'shared/analyticsUtils'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
import { getAppleDeviceFamily } from 'shared/appleDevicesTable'
import { prop } from 'ramda'

const getAppAndDeviceProperties = () => {
  const { device } = window
  const { model, version, platform, manufacturer } = device

  let deviceModel
  let deviceBrowserVersion

  if (platform === 'iOS') {
    deviceModel = getAppleDeviceFamily(model)
    deviceBrowserVersion = version
  } else {
    deviceModel = `${manufacturer}, ${model}`
  }

  return {
    'App Build': appVersion(),
    'App Flavor': process.env.REACT_APP_FLAVOR,
    'OS Version': version,
    ...(deviceBrowserVersion ? { $browser_version: deviceBrowserVersion } : {}),
    $device: deviceModel
  }
}

export const loggedIn = user => {
  const { mixpanel } = window
  const {
    uniqueId: userId,
    firstName,
    lastName,
    email,
    dealerName,
    recordType: dealerType
  } = getUserProfile(user)
  const appAndDeviceProperties = getAppAndDeviceProperties()

  mixpanel.register(appAndDeviceProperties)
  mixpanel.identify(userId)
  mixpanel.people.set(appAndDeviceProperties)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.track('Login', { Success: true })

  return MIXPANEL_EVENT_QUEUED('Login - Success')
}

export const loginFailed = () => {
  const { mixpanel } = window
  const appAndDeviceProperties = getAppAndDeviceProperties()

  mixpanel.register(appAndDeviceProperties)
  mixpanel.track('Login', { Success: false })

  return MIXPANEL_EVENT_QUEUED('Login - Failed')
}

export const scanPVS = ({ pvsSN, entryMethod }, event) => {
  const { mixpanel } = window

  mixpanel.register({ 'PVS SN': pvsSN })
  mixpanel.track('Scan PVS Tag', {
    'Entry Method': entryMethod
  })

  return MIXPANEL_EVENT_QUEUED(event)
}

export const siteNotFound = ({
  uniqueId: userId,
  firstName,
  lastName,
  email,
  dealerName,
  recordType: dealerType
}) => {
  const { mixpanel } = window
  const appAndDeviceProperties = getAppAndDeviceProperties()

  mixpanel.unregister('PVS SN')
  mixpanel.register(appAndDeviceProperties)
  mixpanel.identify(userId)
  mixpanel.people.set(appAndDeviceProperties)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.track('Find Site', { Found: false })

  return MIXPANEL_EVENT_QUEUED('Find Site - site not found')
}

export const siteFound = (
  {
    uniqueId: userId,
    firstName,
    lastName,
    email,
    dealerName,
    recordType: dealerType
  },
  { city, st_id, postalCode, siteKey, commissioningStatus }
) => {
  const { mixpanel } = window
  const appAndDeviceProperties = getAppAndDeviceProperties()

  mixpanel.unregister('PVS SN')
  mixpanel.register(appAndDeviceProperties)
  mixpanel.identify(userId)
  mixpanel.people.set(appAndDeviceProperties)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.register({
    'Site ID': siteKey,
    'Initial Commissioning Status': commissioningStatus
  })

  mixpanel.track('Find Site', {
    Found: true,
    $city: city,
    State: st_id,
    'Zip Code': postalCode
  })

  return MIXPANEL_EVENT_QUEUED('Find Site - site found')
}

export const createSite = ({ success, error = '' }) => {
  const { mixpanel } = window

  mixpanel.track('Create Site', {
    Success: success,
    ...(error && { Error: error })
  })

  return MIXPANEL_EVENT_QUEUED(
    `Create Site - site creation ${success ? 'successful' : 'failed'}`
  )
}

export const saveConfiguration = config => {
  const { mixpanel } = window
  mixpanel.track('Configure', config)
  return MIXPANEL_EVENT_QUEUED('Configure - submit site config')
}

export const saveInventory = (inventory, hasEss) => {
  const { mixpanel } = window

  mixpanel.register({
    'Equinox Storage Site': hasEss
  })

  mixpanel.track('Inventory', {
    'AC Module Count': prop('AC_MODULES', inventory),
    'ESS System Size': hasEss ? prop('ESS', inventory) : 'None',
    'Equinox Storage Site': hasEss
  })
  return MIXPANEL_EVENT_QUEUED('Inventory')
}

export const deviceResume = pageResume => {
  const { mixpanel } = window
  mixpanel.register({
    Page: pageResume
  })
  return MIXPANEL_EVENT_QUEUED('User opens app - Register page resume')
}

/**
 *
 * @param {string}[interfaceType] - The type of connection the user has. either can be  PVS, Cell, or Customer WiFi
 * @return {Action<null, null>}
 */
export const internetConnection = (interfaceType = '') => {
  const { mixpanel } = window
  mixpanel.register({
    'Internet Connection': interfaceType
  })
  return MIXPANEL_EVENT_QUEUED('User opens app - Register page resume')
}

export const pvsInternet = ({ connectionMethod, success, duration }) => {
  const { mixpanel } = window

  mixpanel.track('Internet Setup', {
    'Connection Method': connectionMethod,
    Success: success,
    $duration: duration
  })

  return MIXPANEL_EVENT_QUEUED(
    `User setups PVS Internet - ${
      success ? 'Successful' : 'Unsuccessful'
    } ${connectionMethod} connection (${duration}s)`
  )
}

export const firmwareUpdateEvent = data => {
  const { mixpanel } = window
  mixpanel.track('Firmware Update', {
    'Current FW Version': prop('fromFWVersion', data),
    'Current BN Version': prop('fromBuildNumber', data),
    'New FW Version': prop('toFWVersion', data),
    'New BN Version': prop('toBuildNumber', data),
    Success: prop('success', data)
  })
  return MIXPANEL_EVENT_QUEUED('Firmware update - Update successful')
}

export const timeMixPanelEvent = name => {
  if (!name) throw new Error('The name parameter is required')
  const { mixpanel } = window
  mixpanel.time_event(name)
}

export const commissionSite = ({
  duration,
  timeConfiguring,
  timeFromMiScan
}) => {
  const { mixpanel } = window
  mixpanel.track('Commission Site', {
    $duration: duration,
    'Time Configuring': timeConfiguring,
    'Duration from MI Scan': timeFromMiScan
  })
  mixpanel.unregister('PVS SN')
  return MIXPANEL_EVENT_QUEUED(
    'Commission Site - first successful site configuration'
  )
}

export const registerHomeOwnerAccount = ({ location, errorMessage }) => {
  const { mixpanel } = window
  mixpanel.track('Register HomeOwner', {
    success: !errorMessage,
    location,
    errorMessage
  })
  return MIXPANEL_EVENT_QUEUED('Register HO')
}

export const setACModuleType = ({ timeElapsed, errorCodes, moduleTypes }) => {
  const { mixpanel } = window
  if (Array.isArray(errorCodes) && errorCodes.length !== 0) {
    mixpanel.track('Set AC Module Type', { success: false, errorCodes })
    return MIXPANEL_EVENT_QUEUED('Set AC Module Type - No success')
  }
  mixpanel.track('Set AC Module Type', {
    success: true,
    $duration: timeElapsed,
    moduleTypes
  })
  return MIXPANEL_EVENT_QUEUED('Set AC Module type - success')
}
export const finishPLTWizard = () => {
  const { mixpanel } = window
  mixpanel.track('Panel Layout Setup')
  return MIXPANEL_EVENT_QUEUED('Panel Layout Setup')
}

export const trackConnectedDeviceFWUpdate = config => {
  const { mixpanel } = window
  mixpanel.track('ESS F/W Update', config)
  return MIXPANEL_EVENT_QUEUED('Connected Device FW Update')
}
