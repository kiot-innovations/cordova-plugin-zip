import appVersion from '../macros/appVersion.macro'
import { capitalizeWord, getUserProfile } from 'shared/analyticsUtils'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
import { getIosDeviceFamily } from 'shared/iosDeviceTable'

const registerSuperProperties = () => {
  const { mixpanel, device } = window
  const { model, version, platform, manufacturer } = device
  mixpanel.register({ 'App Build': appVersion(), 'OS Version': version })

  if (platform === 'iOS') {
    mixpanel.register({
      $device: getIosDeviceFamily(model),
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

  mixpanel.identify(userId)
  registerSuperProperties()
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

  registerSuperProperties()
  mixpanel.track('Login', { Success: false })

  return MIXPANEL_EVENT_QUEUED('Login - Failed')
}
