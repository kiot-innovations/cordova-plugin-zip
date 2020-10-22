import appVersion from '../macros/appVersion.macro'
import { capitalizeWord, getUserProfile } from 'shared/analyticsUtils'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
import { getAppleDeviceFamily } from 'shared/appleDevicesTable'

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
  const [
    userId,
    firstName,
    lastName,
    email,
    dealerName,
    dealerType
  ] = getUserProfile(user)
  const appAndDeviceProperties = getAppAndDeviceProperties()

  mixpanel.register(appAndDeviceProperties)
  mixpanel.identify(userId)
  mixpanel.people.set(appAndDeviceProperties)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'User Name': email,
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

export const scanPVS = (scanData, event) => {
  const { mixpanel } = window
  const [pvsSN, entryMethod, timeElapsed] = scanData

  mixpanel.register({ 'PVS SN': pvsSN })
  mixpanel.track('Scan PVS Tag', {
    'Entry Method': entryMethod,
    'Time Elapsed': timeElapsed
  })

  return MIXPANEL_EVENT_QUEUED(event)
}

export const siteNotFound = (
  {
    uniqueId: userId,
    firstName,
    lastName,
    email,
    dealerName,
    recordType: dealerType
  },
  searchField = ''
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
    'User Name': email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.track('Find Site', { Found: false, 'Search Query': searchField })

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
  siteData
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
    'User Name': email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.track('Find Site', {
    Found: true,
    ...siteData
  })

  return MIXPANEL_EVENT_QUEUED('Find Site - site found')
}

export const saveConfiguration = config => {
  const { mixpanel } = window
  mixpanel.track('Configure', config)
  return MIXPANEL_EVENT_QUEUED('Configure - submit site config')
}
