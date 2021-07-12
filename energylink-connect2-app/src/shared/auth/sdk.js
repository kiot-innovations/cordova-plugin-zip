import jwtDecode from 'jwt-decode'
import moment from 'moment'
import { fromPairs, head, join, map, pipe, split, tail, toPairs } from 'ramda'

import config from './config'

import { openUrl } from 'shared/browserUtils'

/******************************************************************************
 *         OAuth 2/OpenID Connect Protocol API
 ******************************************************************************/

/**
 *  Authorize the client
 *
 */
const authorizeOAuth = () => {
  let authUrl =
    `${getBaseApiUrlOAuth(true)}?` +
    `client_id=${config.client_id}&` +
    `redirect_uri=${config.redirectUri}&` +
    `response_type=${config.response_type}`
  openUrl(authUrl)
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
  const { exp } = atob(access_token.split('.')[1])
  const isValid = moment(exp * 1000).isAfter(Date.now())
  return isValid
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
  fetch(apiPath, {
    method: 'POST',
    headers,
    body: buildURL(body)
  }).then(res => res.json())

const parseURL = pipe(
  split('?'),
  tail,
  head,
  split('&'),
  map(split('=')),
  fromPairs
)

const buildURL = pipe(toPairs, map(join('=')), join('&'))

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
