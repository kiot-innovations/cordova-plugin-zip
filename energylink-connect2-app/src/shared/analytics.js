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
  { city, st_id, postalCode, siteKey, commissioned }
) => {
  const { mixpanel } = window
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
  mixpanel.track('Find Site', {
    Found: true,
    ...{
      $city: city,
      State: st_id,
      'Zip Code': postalCode,
      'Site ID': siteKey,
      Commissioned: commissioned
    }
  })

  return MIXPANEL_EVENT_QUEUED('Find Site - site found')
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

export const commissionSite = ({ duration, timeConfiguring }) => {
  const { mixpanel } = window
  mixpanel.track('Commission Site', {
    $duration: duration,
    'Time Configuring': timeConfiguring
  })
  return MIXPANEL_EVENT_QUEUED(
    'Commission Site - first successful site configuration'
  )
}
