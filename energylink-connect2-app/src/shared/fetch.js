import { path } from 'ramda'

export const httpPost = (path, data, state = null, token) => {
  const authHeader = {
    Authorization: `Bearer ${state ? state.user.auth.access_token : token}`
  }

  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader
    },
    body: JSON.stringify(data)
  })
    .then(res => parseResponse(res))
    .catch(err => console.error(err))
}

export const httpGet = (path, state = null, token) => {
  const authHeader = {
    Authorization: `Bearer ${state ? state.user.auth.access_token : token}`
  }

  return fetch(process.env.REACT_APP_EDP_API_URL + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader
    }
  })
    .then(res => parseResponse(res))
    .catch(err => console.error(err))
}

export const httpPatch = (path, data, state = null) => {
  const authHeader =
    state && state.user && state.user.auth
      ? { Authorization: `SP-CUSTOM ${state.user.auth.tokenID}` }
      : {}

  return fetch(process.env.REACT_APP_EDP_API_URL + path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader
    },
    body: JSON.stringify(data)
  })
    .then(res => parseResponse(res))
    .catch(err => console.error(err))
}

export const httpDelete = (path, state = null) => {
  const authHeader =
    state && state.user && state.user.auth
      ? { Authorization: `SP-CUSTOM ${state.user.auth.tokenID}` }
      : {}

  return fetch(process.env.REACT_APP_EDP_API_URL + path, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader
    }
  })
    .then(res => parseResponse(res))
    .catch(err => console.error(err))
}

const parseResponse = res => {
  return res.headers.get('content-length') === '0'
    ? { status: res.status }
    : res
        .json()
        .then(data => ({
          status: res.status,
          data
        }))
        .catch(err => console.error(err))
}

export const postEncodedBody = (
  body,
  state = {},
  URL = 'https://dev-edp-api.dev-edp.sunpower.com/v1/party/feedback'
) => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${path(['user', 'auth', 'access_token'], state)}`
    },
    body
  })
    .then(res => parseResponse(res))
    .catch(err => console.error(err))
}

export const postBinary = (
  body,
  URL = 'https://dev-serial-numbers-scanner.dev-edp.sunpower.com/scan'
) =>
  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body
  })

export const encodedParams = values => {
  return Object.keys(values)
    .map(key => {
      const param =
        encodeURIComponent(key) + '=' + encodeURIComponent(values[key])
      return param
    })
    .join('&')
}
