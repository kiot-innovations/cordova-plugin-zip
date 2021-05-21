import moment from 'moment'
import marked from 'marked'

import {
  any,
  assoc,
  clone,
  compose,
  concat,
  curry,
  defaultTo,
  dissoc,
  endsWith,
  equals,
  filter,
  find,
  flip,
  head,
  includes,
  indexBy,
  isEmpty,
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
  pathOr,
  pickBy,
  prop,
  propEq,
  propOr,
  propSatisfies,
  reject,
  replace,
  slice,
  split,
  startsWith,
  toPairs,
  toUpper,
  trim,
  values,
  when
} from 'ramda'
import { appConnectionStatus } from 'state/reducers/network'

export const either = (condition, whenTrue, whenFalse = null) =>
  condition ? whenTrue : whenFalse

export function createMarkup(recommendedAction) {
  return { __html: marked(recommendedAction) }
}

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

export const isValidSN = sn => /^(?:\d{12}|\d{15})$/.test(sn)

export const isDownloadingFiles = state =>
  any(equals(true), [
    path(['fileDownloader', 'progress', 'downloading'], state),
    path(['ess', 'isDownloading'], state),
    pathEq(['fileDownloader', 'pvs6GridProfileInfo', 'progress'], '100', state),
    pathEq(['fileDownloader', 'pvs5GridProfileInfo', 'progress'], '100', state)
  ])

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

export const barcodeValidator = barcode => {
  const cleanBarcode = barcode.trim()
  const currentYearCode = new Date().getFullYear() % 100
  const yearcode = parseInt(slice(2, 4, cleanBarcode))
  const weekcode = parseInt(slice(4, 6, cleanBarcode))
  if (length(cleanBarcode) === 12) {
    if (yearcode >= 18 && yearcode <= currentYearCode) {
      if (weekcode >= 1 && weekcode <= 53) {
        return true
      }
    }
  }

  return false
}

export const buildSN = barcode => {
  console.info(barcode)
  return {
    serial_number: barcodeValidator(barcode) ? `E00${barcode}` : barcode,
    type: 'SOLARBRIDGE'
  }
}

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
    // eslint-disable-next-line no-prototype-builtins
    if (!ob.hasOwnProperty(i)) continue
    if (typeof ob[i] == 'object') {
      var flatObject = flattenObject(ob[i])
      for (var x in flatObject) {
        // eslint-disable-next-line no-prototype-builtins
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
  AC_Module_Type_C: 'Type C',
  AC_Module_Type_D: 'Type D',
  AC_Module_Type_E: 'Type E',
  AC_Module_Type_G: 'Type G',
  AC_Module_Type_H: 'Type H'
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
  pathOr('cm2-test', ['REACT_APP_FLAVOR'], process.env).split('-')[1]

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
const removeCarriageReturn = replace(/[\n\r]+/gi, '')
export const parseMD5FromResponse = compose(
  trim,
  removeCarriageReturn,
  head,
  split(' ')
)
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

export const isTest = includes(process.env.REACT_APP_FLAVOR, ['cm2-test'])

export const isDebug = includes(process.env.REACT_APP_FLAVOR, [
  'cm2-uat',
  'cm2-test'
])

export const isProd = includes(process.env.REACT_APP_FLAVOR, [
  'cm2-prod',
  'cm2-training'
])

export const isSerialEqual = (x, y) => x.SERIAL === y.SERIAL

export const buildFullAddress = (address1, address2, streetId, city) =>
  `${address1}${address2 ? ', ' + address2 : ''} ${city ? ', ' + city : ''}${
    streetId ? ', ' + streetId : ''
  }`

export const getBLEPath = isIos()
  ? ['advertising', 'kCBAdvDataLocalName']
  : ['name']

// { name: string, id: string} -> Boolean
export const isPVSDevice = compose(
  startsWith('ZT'),
  defaultTo(''),
  prop('name')
)

export const eqByProp = curry((prop, obj1, obj2) => obj1[prop] === obj2[prop])

export const generateCandidates = map(device => ({
  DEVICE_TYPE: 'Inverter',
  SERIAL: prop('serial_number', device)
}))

export const getAccessToken = path(['user', 'auth', 'access_token'])

export const getUrl = () => compose(last, split('#'))(window.location.href)

export const getElapsedTime = (initialTimestamp = 0) => {
  const now = Date.now()
  const it = initialTimestamp || now
  return (now - it) / 1000
}

export const headersToObj = headers => {
  const parsedHeaders = {}
  for (const [key, value] of headers) {
    parsedHeaders[key] = value
  }
  return parsedHeaders
}

export const edpErrorMessage = ({ code = '', message = '' }) =>
  code && message ? `${code}: ${message}` : message

export const gotDisconnection = (prev, current) =>
  prev === appConnectionStatus.CONNECTED &&
  current !== appConnectionStatus.CONNECTED

export const gotReconnection = (prev, current) =>
  prev !== appConnectionStatus.CONNECTED &&
  current === appConnectionStatus.CONNECTED

export const createMeterConfig = (devicesList, meterConfig, site) => {
  const updatedDevices = devicesList.map(device => {
    if (
      device.DEVICE_TYPE === 'Power Meter' &&
      endsWith('p', device.SERIAL) &&
      meterConfig.productionCT
    ) {
      device.SUBTYPE = meterConfig.productionCT
    }

    if (
      device.DEVICE_TYPE === 'Power Meter' &&
      endsWith('c', device.SERIAL) &&
      meterConfig.consumptionCT
    ) {
      device.SUBTYPE = meterConfig.consumptionCT
    }

    return device
  })

  return {
    metaData: {
      site_key: site,
      devices: updatedDevices
    }
  }
}
export const isPvs5 = pathEq(['value', 'pvs', 'model'], 'PVS5')

export const getGPDownloadError = state$ => {
  const pvsGridProfileInfo = isPvs5(state$)
    ? 'pvs5GridProfileInfo'
    : 'pvs6GridProfileInfo'

  return path(['value', 'fileDownloader', pvsGridProfileInfo, 'error'], state$)
}
