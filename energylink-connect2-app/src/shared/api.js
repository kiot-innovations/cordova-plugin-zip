import Swagger from 'swagger-client'
let apiParty, apiSite, apiFirmware, apiScanSN

const requestOptions = access_token => ({
  requestInterceptor: req => {
    if (access_token) req.headers['Authorization'] = `Bearer ${access_token}`
    return req
  }
})

export async function getApiFirmware() {
  if (!apiFirmware)
    apiFirmware = await Swagger(process.env.REACT_APP_SWAGGER_FIRMWARE)
  return apiFirmware
}
export async function getApiPVS() {
  return await Swagger(process.env.REACT_APP_PVS_ADDRESS)
}
export async function getApiDevice(access_token) {
  return await Swagger(
    process.env.REACT_APP_SWAGGER_DEVICE,
    requestOptions(access_token)
  )
}
export async function getApiParty(access_token) {
  apiParty = await Swagger(
    process.env.REACT_APP_SWAGGER_PARTY,
    requestOptions(access_token)
  )
  return apiParty
}
export async function getApiSearch(access_token) {
  return await Swagger(
    process.env.REACT_APP_SWAGGER_SEARCH,
    requestOptions(access_token)
  )
}
export async function getApiSite(access_token) {
  if (!apiSite)
    apiSite = await Swagger(
      process.env.REACT_APP_SWAGGER_SITE,
      requestOptions(access_token)
    )
  return apiSite
}
export async function getApiScanSN() {
  if (!apiScanSN)
    apiScanSN = await Swagger(process.env.REACT_APP_SCAN_SERIAL_NUMBERS)
  return apiScanSN
}
export async function getApiAuth(access_token) {
  return await Swagger(
    process.env.REACT_APP_SWAGGER_AUTH,
    requestOptions(access_token)
  )
}
export const storageSwaggerTag = 'Commissioning'
