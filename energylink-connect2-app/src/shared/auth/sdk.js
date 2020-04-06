import { split, map, fromPairs, pipe, tail, head } from 'ramda'
import jwtDecode from 'jwt-decode'
import config from './config'
import { createExternalLinkHandler } from 'shared/routing'

/******************************************************************************
 *         OAuth 2/OpenID Connect Protocol API
 ******************************************************************************/

/**
 *  Authorize the client
 *
 * @param state a string that specifies an optional parameter that is used to maintain state between the logout request and the callback to the endpoint specified by the post_logout_redirect_uri query parameter.
 * @param nonce a string that is used to associate a client session with an ID token, and to mitigate replay attacks. The value is passed through unmodified from the authentication request to the ID token.
 */
const authorizeOAuth = state => {
  let authUrl =
    `${getBaseApiUrlOAuth(true)}?` +
    `client_id=${config.client_id}&` +
    `redirect_uri=${config.redirectUri}&` +
    `response_type=${config.response_type}`
  createExternalLinkHandler(authUrl)()
}

const getUserInfoOAuth = access_token =>
  new Promise((resolve, reject) => {
    try {
      const user = jwtDecode(access_token)
      resolve(user)
    } catch (error) {
      reject(null)
    }
  })

const verifyTokenOAuth = access_token => {
  const params = {
    token: access_token
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${config.token_secret}`,
    access_token_manager_id: 'atm:jwt'
  }
  return post(getBaseApiUrlOAuth(true, true), headers, params)
}

const refreshTokenOAuth = refresh_token => {
  const params = {
    grant_type: 'refresh_token',
    refresh_token,
    client_id: config.client_id
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${config.secret}`,
    access_token_manager_id: 'atm:jwt'
  }
  return post(getBaseApiUrlOAuth(), headers, params)
}

/**
 * Obtain an access token in a format of:
 * {access_token: "bla", token_type: "Bearer", expires_in: 3600, scope: "address phone openid profile email", id_token: "bla"}
 *
 * Note that authentication requirements to this endpoint are configured by the application’s tokenEndpointAuthMethod property
 * @param code a string that specifies the authorization code returned by the authorization server. This property is required only if the grant_type is set to authorization_code
 */
const getAccessTokenOAuth = code => {
  const params = {
    grant_type: config.grantType,
    redirect_uri: config.redirectUri,
    client_id: config.client_id,
    code
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${config.secret}`,
    access_token_manager_id: 'atm:jwt'
  }
  return post(getBaseApiUrlOAuth(), headers, params)
}

const getBaseApiUrlOAuth = (useAuthUrl, useCheckTokenURI) => {
  if (useCheckTokenURI) {
    return config.FED_TOKEN_CHECK_URI
  }
  return useAuthUrl
    ? config.FED_AUTH_URI // base API URL for auth things like the flow orchestration service
    : config.FED_TOKEN_URI // base API URL for non-auth things
}

const post = (apiPath, headers, body = {}) =>
  new Promise((resolved, rejected) =>
    window.cordovaHTTP.post(
      apiPath,
      body,
      headers,
      function(response) {
        try {
          const data = JSON.parse(response.data)
          resolved(data)
        } catch (error) {
          console.error(error)
          rejected(error)
        }
      },
      function(response) {
        console.error(response)
        rejected(response.error)
      }
    )
  )

const parseURL = pipe(
  split('?'),
  tail,
  head,
  split('&'),
  map(split('=')),
  fromPairs
)

// const buildURL = pipe(toPairs, map(join('=')), join('&'))

const generateRandomValue = () => {
  let crypto = window.crypto || window.msCrypto
  let D = new Uint32Array(2)
  crypto.getRandomValues(D)
  return D[0].toString(36)
}

export default {
  authorizeOAuth,
  getAccessTokenOAuth,
  getUserInfoOAuth,
  verifyTokenOAuth,
  refreshTokenOAuth,
  parseURL,
  generateRandomValue
}
