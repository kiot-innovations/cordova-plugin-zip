export const either = (condition, whenTrue, whenFalse) =>
  condition ? whenTrue : whenFalse

/**
 * Will return the data of the placed found with google maps
 * @param address
 * @returns {Promise<{address_components, geometry}>}
 */
export function geocodeByAddress(address) {
  const geocoder = new window.google.maps.Geocoder()
  const OK = window.google.maps.GeocoderStatus.OK
  return new Promise(function(resolve, reject) {
    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== OK) reject(status)
      resolve(Array.isArray(results) ? results[0] : {})
    })
  })
}

export function getGeocodeData({ address_components, geometry }) {
  const data = address_components.map(elem => ({
    name: elem.long_name,
    type: elem.types.shift()
  }))

  const lat = geometry.location.lat()
  const lng = geometry.location.lng()
  //parsed data so we can use it in the setState
  const parsedData = {}
  data.forEach(elem => {
    parsedData[elem.type] = elem.name
  })
  return { parsedData, lat, lng }
}

export const scanBarcodes = (success, fail) => {
  window.cordova.plugins.barcodeScanner.scan(
    function(result) {
      if (result.text) {
        success(result.text)
      }
    },
    function(error) {
      alert('Scanning failed: ' + error)
      fail(error)
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt: 'Place a QR Code inside the scan area', // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: false, // iOS
      disableSuccessBeep: false // iOS and Android
    }
  )
}
