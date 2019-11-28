import Swagger from 'swagger-client'

export let apiAuth, apiDevice, apiParty, apiSearch, apiSite

export default () => {
  Swagger(process.env.REACT_APP_SWAGGER_AUTH).then(client => {
    apiAuth = client
  })

  Swagger(process.env.REACT_APP_SWAGGER_DEVICE).then(client => {
    apiDevice = client
  })

  Swagger(process.env.REACT_APP_SWAGGER_PARTY).then(client => {
    apiParty = client
  })

  Swagger(process.env.REACT_APP_SWAGGER_SEARCH).then(client => {
    apiSearch = client
  })

  Swagger(process.env.REACT_APP_SWAGGER_SITE).then(client => {
    apiSite = client
  })
}
