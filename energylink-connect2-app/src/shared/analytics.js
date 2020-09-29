const { mixpanel } = window

export const loggedIn = user => {
  const { uniqueId, firstName, lastName, email, recordType } = user

  mixpanel.identify(uniqueId)
  mixpanel.people.set({
    $first_name: firstName,
    $last_name: lastName,
    $email: email,
    'User Name': email,
    'Dealer Type': recordType // recordType.toLowerCase.charAt(0).toUpperCase()
  })
  mixpanel.track('Login', { Success: true })
}
