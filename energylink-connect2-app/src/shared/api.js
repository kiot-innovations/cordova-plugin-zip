import Swagger from 'swagger-client'
let apiDevice, apiParty, apiSearch, apiSite, apiFirmware, apiScanSN

const requestOptions = access_token => ({
  requestInterceptor: req => {
    if (access_token) req.headers['Authorization'] = `Bearer ${access_token}`
    return req
  },

  userFetch: (url, options) =>
    new Promise((resolve, reject) => {
      const METHOD = options.method.toLowerCase()
      const body = options.body ? JSON.parse(options.body) : {}
      window.cordovaHTTP[METHOD](
        url,
        body,
        options.headers || {},
        function(response) {
          console.info('HTTP Request RESPONSE SUCCESS')
          console.info(response)

          resolve(
            new Response(response.data, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            })
          )
        },
        function(response) {
          try {
            console.error('HTTP Request RESPONSE ERROR')
            console.error(response)
            console.error('It Was Sent With:')
            console.info(options)
            console.error('URL')
            console.info(url)
            reject(JSON.parse(response.error))
          } catch (error) {
            reject(response.error)
          }
        }
      )
    })
})

export async function getApiFirmware() {
  if (!apiFirmware)
    apiFirmware = await Swagger(process.env.REACT_APP_SWAGGER_FIRMWARE)
  return apiFirmware
}
export async function getApiPVS() {
  return await Swagger(process.env.REACT_APP_PVS_ADDRESS)
}
export async function getApiDevice() {
  if (!apiDevice)
    apiDevice = await Swagger(process.env.REACT_APP_SWAGGER_DEVICE)
  return apiDevice
}
export async function getApiParty(access_token) {
  apiParty = await Swagger(
    process.env.REACT_APP_SWAGGER_PARTY,
    requestOptions(access_token)
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
      requestOptions(access_token)
    )
  return apiSite
}
export async function getApiScanSN() {
  if (!apiScanSN)
    apiScanSN = await Swagger(process.env.REACT_APP_SCAN_SERIAL_NUMBERS)
  return apiScanSN
}
