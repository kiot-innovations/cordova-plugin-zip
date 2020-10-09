import appVersion from '../macros/appVersion.macro'
import { capitalizeWord, getUserProfile } from 'shared/analyticsUtils'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
import { getAppleDeviceFamily } from 'shared/appleDevicesTable'

const registerLoginSuperProperties = () => {
  const { mixpanel, device } = window
  const { model, version, platform, manufacturer } = device

  mixpanel.register({ 'App Build': appVersion(), 'OS Version': version })

  if (platform === 'iOS') {
    mixpanel.register({
      $device: getAppleDeviceFamily(model),
      $browser_version: version
    })
  } else {
    mixpanel.register({
      $device: `${manufacturer}, ${model}`
    })
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

  registerLoginSuperProperties()
  mixpanel.identify(userId)
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

  registerLoginSuperProperties()
  mixpanel.track('Login', { Success: false })

  return MIXPANEL_EVENT_QUEUED('Login - Failed')
}

export const siteNotFound = (searchField = '') => {
  const { mixpanel } = window
  mixpanel.track('Find site', { Found: false, 'Search query': searchField })
  return MIXPANEL_EVENT_QUEUED('Find site - site not found')
}

export const siteFound = siteData => {
  const { mixpanel } = window
  mixpanel.track('Find site', {
    Found: true,
    ...siteData
  })
  return MIXPANEL_EVENT_QUEUED('Find site - site found')
}

export const saveConfiguration = config => {
  const { mixpanel } = window
  mixpanel.track('Configure', config)
  return MIXPANEL_EVENT_QUEUED('Configure - submit site config')
}
