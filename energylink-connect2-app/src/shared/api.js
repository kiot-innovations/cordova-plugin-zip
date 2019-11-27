import Swagger from 'swagger-client'

export let apiAuth, apiDevice, apiParty, apiSearch, apiSite

export default () => {
  Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-auth').then(
    client => {
      apiAuth = client
    }
  )

  Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-device').then(
    client => {
      apiDevice = client
    }
  )

  Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-party').then(
    client => {
      apiParty = client
    }
  )

  Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-search').then(
    client => {
      apiSearch = client
    }
  )

  Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-site').then(
    client => {
      apiSite = client
    }
  )
}
