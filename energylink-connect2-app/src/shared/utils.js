import {
  compose,
  join,
  over,
  lensIndex,
  toUpper,
  lt,
  when,
  length,
  prop,
  find,
  propEq,
  map,
  defaultTo,
  curry,
  dissoc,
  assoc,
  pathEq,
  includes,
  pickBy,
  toPairs,
  values,
  filter
} from 'ramda'

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

export const isValidSN = sn => /^\d{12,}$/.test(sn)

export const waitFor = (ms = 0) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const capitalize = when(
  compose(lt(0), length),
  compose(join(''), over(lensIndex(0), toUpper))
)

export const isIos = () => window.device.platform === 'iOS'

/* ACCESS POINT HELPERS */
export const buildAPItem = ap => ({ label: ap.ssid, value: ap.ssid, ap })
export const buildAPsItems = map(buildAPItem)

export const getCurrentlyConnectedInterface = compose(
  prop('ssid'),
  find(propEq('interface', 'sta0'))
)

export const getConnectedAP = (interfaces, aps) =>
  compose(
    buildAPItem,
    defaultTo({ ssid: '' }),
    find(propEq('ssid', getCurrentlyConnectedInterface(interfaces)))
  )(aps)

export const groupBy = (array, prop) => {
  return array.reduce((acc, obj) => {
    const key = obj[prop]
    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(obj)
    return acc
  }, {})
}

export const cleanString = (str = '') => {
  const regex = /\W+/g
  return str.replace(regex, '')
}

const decideModel = barcode =>
  barcode.startsWith('1') || barcode.startsWith('E001') ? 'Type E' : 'Type G'

export const buildSN = barcode => ({
  serial_number: barcode.startsWith('1') ? `E00${barcode}` : barcode,
  miType: decideModel(barcode),
  type: 'SOLARBRIDGE'
})
export const trace = t => x => {
  console.info(t)
  console.info(x)
  return x
}
export const renameKey = curry((oldKey, newKey, obj) =>
  assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj))
)

export const updateBodyHeight = () => {
  const current = document.body.style.height
  document.body.style.height = `${current === '100vh' ? 101 : 100}vh`
}

export const findByPathValue = curry((arr, path, value) =>
  find(pathEq(path, value))(arr)
)

const flattenObject = ob => {
  const toReturn = {}

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue
    if (typeof ob[i] == 'object') {
      var flatObject = flattenObject(ob[i])
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

export const findProp = curry((prop, obj) =>
  compose(includes(prop), values, flattenObject)(obj)
)

export const filterInverters = filter(propEq('DEVICE_TYPE', 'Inverter'))

export const applyToEventListeners = (
  addRemoveEventListenerFn,
  eventListeners
) =>
  toPairs(
    pickBy((_, event) => eventListeners[event], eventListeners)
  ).map(([eventName, callback]) =>
    addRemoveEventListenerFn(eventName, callback)
  )
