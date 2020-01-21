import Swagger from 'swagger-client'

let apiDevice, apiParty, apiSearch, apiSite, apiFirmware, apiPVS, apiScanSN

const authOptions = access_token => ({
  requestInterceptor: req => {
    req.headers['Authorization'] = `Bearer ${access_token}`
    return req
  }
})

export async function getApiFirmware() {
  if (!apiFirmware)
    apiFirmware = await Swagger(process.env.REACT_APP_SWAGGER_FIRMWARE)
  return apiFirmware
}
export async function getApiPVS() {
  if (!apiPVS)
    try {
      apiPVS = await Swagger(process.env.REACT_APP_PVS_ADDRESS)
    } catch (e) {
      throw Error("I'm not able to reach a PVS")
    }
  return apiPVS
}
export async function getApiDevice() {
  if (!apiDevice)
    apiDevice = await Swagger(process.env.REACT_APP_SWAGGER_DEVICE)
  return apiDevice
}
export async function getApiParty(access_token) {
  if (!apiParty)
    apiParty = await Swagger(
      process.env.REACT_APP_SWAGGER_PARTY,
      authOptions(access_token)
    )
  return apiParty
}
export async function getApiSearch() {
  if (!apiSearch)
    apiSearch = await Swagger(process.env.REACT_APP_SWAGGER_SEARCH)
  return apiSearch
}
export async function getApiSite(access_token) {
  if (!apiSite)
    apiSite = await Swagger(
      process.env.REACT_APP_SWAGGER_SITE,
      authOptions(access_token)
    )
  return apiSite
}
export async function getApiScanSN() {
  if (!apiScanSN)
    apiScanSN = await Swagger(process.env.REACT_APP_SCAN_SERIAL_NUMBERS)
  return apiScanSN
}
