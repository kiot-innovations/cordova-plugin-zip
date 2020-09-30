import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
const { mixpanel } = window

export const loggedIn = user => {
  const {
    uniqueId,
    firstName,
    lastName,
    email,
    dealerName,
    recordType: dealerType
  } = user

  mixpanel.identify(uniqueId)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'User Name': email,
    'Dealer Name': dealerName,
    'Dealer Type': dealerType
  })
  mixpanel.track('Login', { Success: true })

  return MIXPANEL_EVENT_QUEUED()
}
