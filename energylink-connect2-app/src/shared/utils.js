import moment from 'moment'

import {
  assoc,
  clone,
  compose,
  concat,
  curry,
  defaultTo,
  dissoc,
  filter,
  find,
  flip,
  head,
  includes,
  indexBy,
  isNil,
  join,
  keys,
  last,
  length,
  lensIndex,
  lt,
  map,
  over,
  path,
  pathEq,
  pickBy,
  prop,
  propEq,
  propOr,
  propSatisfies,
  reject,
  replace,
  split,
  toPairs,
  toUpper,
  values,
  when,
  pathOr,
  isEmpty
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
    long_name: elem.long_name,
    short_name: elem.short_name,
    type: elem.types.shift()
  }))

  const lat = geometry.location.lat()
  const lng = geometry.location.lng()
  //parsed data so we can use it in the setState
  const parsedData = {}
  data.forEach(elem => {
    parsedData[`${elem.type}_long`] = propOr('', 'long_name', elem)
    parsedData[elem.type] = propOr(
      propOr('', 'long_name', elem),
      'short_name',
      elem
    )
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

export const isIos = () =>
  pathOr('none', ['device', 'platform'], window) === 'iOS'

export const isAndroid10 = () =>
  window.device.platform === 'Android' &&
  parseInt(window.device.version, 10) >= 10

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
  return str.replace(regex, ' ')
}

export const buildSN = barcode => ({
  serial_number:
    barcode.startsWith('12') && length(barcode) === 12
      ? `E00${barcode}`
      : barcode,
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
  const crh = document.body.style.height.split('vh')[0]
  const ch = isEmpty(crh) ? 100 : parseFloat(crh)
  const newheight = ch + 0.2
  document.body.style.height = `${newheight > 102 ? 100 : newheight}vh`
}

export const findByPathValue = curry((arr, path, value) =>
  defaultTo(null, find(pathEq(path, value))(arr))
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
export const replaceSpaceByDashes = replace('/ /g', '-')

export const getLastIPOctet = compose(last, split('.'))

export function padNumber(number, width = 3, separator = '0') {
  const n = number.toString()
  return n.length >= width
    ? n
    : new Array(width - n.length + 1).join(separator) + n
}

export const getPVSVersionNumber = compose(
  Number,
  last,
  split('Build'),
  path(['supervisor', 'SWVER'])
)

export const flipConcat = flip(concat)

export const miTypes = {
  AC_Module_Type_E: 'Type E',
  AC_Module_Type_G: 'Type G',
  AC_Module_Type_C: 'Type C',
  AC_Module_Type_D: 'Type D'
}

export const renameKeys = curry((keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  )
)

export const arrayToObject = curry((key, array) => indexBy(prop(key), array))
const flatErrors = map(prop('device_sn'))

export const addHasErrorProp = results => {
  if (!results || !results.errors) return results

  const copy = clone(results)
  const snErrors = flatErrors(copy.errors)

  keys(copy.ess_report).forEach(key => {
    const keyValue = copy.ess_report[key]
    const newValueForKey = Array.isArray(keyValue)
      ? map(
          value =>
            assoc('hasError', includes(value.serial_number, snErrors), value),
          removeUndefined(keyValue)
        )
      : assoc('hasError', includes(keyValue.serial_number, snErrors), keyValue)

    copy.ess_report[key] = newValueForKey
  })

  return copy
}

export const getAppFlavor = () =>
  pathOr('cm2-test', ['env', 'REACT_APP_FLAVOR'], process).split('-')[1]

export function getEnvironment() {
  if (process.env.REACT_APP_FLAVOR === 'cm2-training') return 'training'
  if (process.env.REACT_APP_FLAVOR === 'cm2-test') return 'test'
  if (process.env.REACT_APP_FLAVOR === 'cm2-uat') return 'beta'
  return 'prod'
}

export const isError = (status = '', percent) =>
  status.toLowerCase() === 'error'

const _strStartsWith = what => (str = '') => str.startsWith(what)

export const strSatisfiesAWarning = str =>
  _strStartsWith('1')(str) || _strStartsWith('0')(str)

/* [a] -> Number */
export const warningsLength = compose(
  length,
  filter(propSatisfies(strSatisfiesAWarning, 'error_code')),
  defaultTo([])
)

export const PERSIST_DATA_PATH = 'cdvfile://localhost/persistent/'

export const calculateTimeout = lastUpdated => {
  const then = moment
    .utc(lastUpdated)
    .local()
    .add(1, 'minutes')
  const diff = moment().diff(then, 'milliseconds')
  return diff < 0 ? Math.abs(diff) + 3000 : 0
}

export const hasInternetConnection = () =>
  new Promise((resolve, reject) =>
    fetch('https://google.com')
      .then(() => resolve())
      .catch(() => reject())
  )

export const removeUndefined = reject(isNil)

export const generateSSID = serialNumber => {
  const lastIndex = serialNumber.length
  const ssidPt1 = serialNumber.substring(4, 6)
  const ssidPt2 = serialNumber.substring(lastIndex - 3, lastIndex)

  return `SunPower${ssidPt1}${ssidPt2}`
}

export const generatePassword = serialNumber => {
  let lastIndex = serialNumber.length
  let password =
    serialNumber.substring(2, 6) +
    serialNumber.substring(lastIndex - 4, lastIndex)
  return password
}
export const parseMD5FromResponse = compose(head, split(' '))
export const renameExtension = replace(/\.tar\.gz$/, '.md5')

export const getExpectedMD5 = async url => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers()
  }

  const res = await fetch(renameExtension(url), requestOptions)
  if (res.ok) {
    return parseMD5FromResponse(await res.text())
  }

  throw new Error(`getExpectedMD5: Failed fetching md5 for: ${url}`)
}

export const isDebug = includes(process.env.REACT_APP_FLAVOR, [
  'cm2-uat',
  'cm2-test'
])

export const isProd = includes(process.env.REACT_APP_FLAVOR, [
  'cm2-prod',
  'cm2-training'
])

export const isSerialEqual = (x, y) => x.SERIAL === y.SERIAL
