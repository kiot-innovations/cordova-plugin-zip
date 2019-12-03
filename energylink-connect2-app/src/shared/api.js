import Swagger from 'swagger-client'

let apiAuth, apiDevice, apiParty, apiSearch, apiSite, apiFirmware

export async function getApiFirmware() {
  if (!apiFirmware)
    apiFirmware = await Swagger(process.env.REACT_APP_SWAGGER_FIRMWARE)
  return apiFirmware
}
export async function getApiAuth() {
  if (!apiAuth) apiAuth = await Swagger(process.env.REACT_APP_SWAGGER_AUTH)
  return apiAuth
}
export async function getApiDevice() {
  if (!apiDevice)
    apiDevice = await Swagger(process.env.REACT_APP_SWAGGER_DEVICE)
  return apiDevice
}
export async function getApiParty() {
  if (!apiParty) apiParty = await Swagger(process.env.REACT_APP_SWAGGER_PARTY)
  return apiParty
}
export async function getApiSearch() {
  if (!apiSearch)
    apiSearch = await Swagger(process.env.REACT_APP_SWAGGER_SEARCH)
  return apiSearch
}
export async function getApiSite() {
  if (!apiSite) apiSite = await Swagger(process.env.REACT_APP_SWAGGER_SITE)
  return apiSite
}
