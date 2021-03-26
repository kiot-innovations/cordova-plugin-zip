import Swagger from 'swagger-client'
let apiParty, apiSite, apiScanSN, apiPVS, apiDevice, apiSearch, apiAuth
let lastAccessToken

const requestOptions = accessToken => ({
  requestInterceptor: req => {
    if (accessToken) req.headers['Authorization'] = `Bearer ${accessToken}`
    return req
  }
})
const resetAllSwaggerDocs = newAccessToken => {
  lastAccessToken = newAccessToken
  apiParty = null
  apiSite = null
  apiPVS = null
  apiDevice = null
  apiSearch = null
}
export async function getApiPVS(forceUpdatePVS = false) {
  if (!apiPVS || forceUpdatePVS)
    apiPVS = await Swagger(
      process.env.REACT_APP_MOCK_SERVER || process.env.REACT_APP_PVS_ADDRESS
    )
  return apiPVS
}

export async function getApiDevice(accessToken, forceUpdate = false) {
  if (lastAccessToken !== accessToken) resetAllSwaggerDocs(accessToken)
  if (forceUpdate || !apiDevice) {
    apiDevice = await Swagger(
      process.env.REACT_APP_SWAGGER_DEVICE,
      requestOptions(accessToken)
    )
  }
  return apiDevice
}

export async function getApiParty(accessToken, forceUpdate = false) {
  if (lastAccessToken !== accessToken) resetAllSwaggerDocs(accessToken)
  if (forceUpdate || !apiParty) {
    apiParty = await Swagger(
      process.env.REACT_APP_SWAGGER_PARTY,
      requestOptions(accessToken)
    )
  }
  return apiParty
}

export async function getApiSearch(accessToken, forceUpdate = false) {
  if (lastAccessToken !== accessToken) resetAllSwaggerDocs(accessToken)
  if (forceUpdate || !apiSearch) {
    apiSearch = await Swagger(
      process.env.REACT_APP_SWAGGER_SEARCH,
      requestOptions(accessToken)
    )
  }
  return apiSearch
}
export async function getApiSite(accessToken, forceUpdate = false) {
  if (lastAccessToken !== accessToken) resetAllSwaggerDocs(accessToken)
  if (!apiSite || forceUpdate)
    apiSite = await Swagger(
      process.env.REACT_APP_SWAGGER_SITE,
      requestOptions(accessToken)
    )
  return apiSite
}
export async function getApiScanSN() {
  if (!apiScanSN)
    apiScanSN = await Swagger(process.env.REACT_APP_SCAN_SERIAL_NUMBERS)
  return apiScanSN
}
export async function getApiAuth(accessToken) {
  if (lastAccessToken !== accessToken) resetAllSwaggerDocs(accessToken)
  if (!apiAuth)
    apiAuth = await Swagger(
      process.env.REACT_APP_SWAGGER_AUTH,
      requestOptions(accessToken)
    )
  return apiAuth
}
export const storageSwaggerTag = 'commissioning'
