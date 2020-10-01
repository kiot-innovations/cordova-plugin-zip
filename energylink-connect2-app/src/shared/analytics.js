import { capitalizeWord, getUserProfile } from 'shared/analyticsUtils'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'

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
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'User Name': email,
    'Dealer Name': dealerName,
    'Dealer Type': capitalizeWord(dealerType)
  })
  mixpanel.track('Login', { Success: true })

  return MIXPANEL_EVENT_QUEUED()
}

export const loginFailed = () => {
  const { mixpanel } = window

  mixpanel.track('Login', { Success: false })

  return MIXPANEL_EVENT_QUEUED()
}
