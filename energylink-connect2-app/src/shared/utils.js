export const either = (condition, whenTrue, whenFalse = null) =>
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

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data.replace(/\s/g, ''))
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}
