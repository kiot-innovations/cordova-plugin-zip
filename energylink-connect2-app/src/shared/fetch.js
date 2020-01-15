export const httpPost = (path, data, state = null) => {
  const authHeader =
    state && state.user && state.user.auth
      ? { Authorization: `SP-CUSTOM ${state.user.auth.tokenID}` }
      : {}

  return fetch(process.env.REACT_APP_EDP_API_URL + path, {
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

export const httpGet = (path, state = null) => {
  const authHeader =
    state && state.user && state.user.auth
      ? { Authorization: `SP-CUSTOM ${state.user.auth.tokenID}` }
      : {}

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
