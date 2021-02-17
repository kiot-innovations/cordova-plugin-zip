export const checkLocationPermissions = () =>
  new Promise((res, rej) =>
    window.cordova.plugins.diagnostic.getLocationAuthorizationStatus(res, rej)
  )

export const requestLocationPermissions = () =>
  new Promise((res, rej) =>
    window.cordova.plugins.diagnostic.requestLocationAuthorization(res, rej)
  )
