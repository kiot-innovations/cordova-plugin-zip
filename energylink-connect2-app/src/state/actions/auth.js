import { createAction } from 'redux-act'
import {
  pipe,
  equals,
  head,
  last,
  prop,
  merge,
  omit,
  identity,
  converge,
  useWith
} from 'ramda'
import { fetchInventory } from './inventory'
import { getFile } from './fileDownloader'
import authClient from 'shared/auth/sdk'
import { httpGet } from 'shared/fetch'

export const LOGIN_INIT = createAction('LOGIN_INIT')
export const LOGIN_SUCCESS = createAction('LOGIN_SUCCESS')
export const LOGIN_ERROR = createAction('LOGIN_ERROR')
export const LOGOUT = createAction('LOGOUT')

export const requestLogin = () => {
  return (dispatch, state) => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsImtpZCI6IkFGQTk3OTJDRjZDNEMzM0FEOUU5RDhCNjU4MDRGNEM5In0.eyJuYW1lIjoiTHVkd2lnIEJlZXRob3ZlbiIsInN1YiI6InNwd3JfdGVzdF9zdXBlcl9hZG1Ab3V0bG9vay5jb20iLCJ1c2VyR3JvdXAiOiJDdXN0b21lciIsImVtYWlsIjoic3B3cl90ZXN0X3N1cGVyX2FkbUBvdXRsb29rLmNvbSIsInVuaXF1ZUlkIjoiMzBhODIxMzAtNjBlYS00MTlmLWJlOTctYTU0YTM5NzBiZjZkIiwiZXhwIjoxNTc4NTQ3NjE1LCJzY29wZSI6W10sImNsaWVudF9pZCI6IkNNMk1vYmlsZSJ9.iNcRldxP45JkpeQrVFRxgPvMRhudsCOVc8TKAh56YZg'

      dispatch(handleUserProfile({ access_token: token }))

      let state = authClient.generateRandomValue()
      dispatch(LOGIN_INIT({ state }))
      authClient.authorizeOAuth(state)
    } catch (err) {
      dispatch(LOGIN_ERROR({ message: err }))
    }
  }
}

export const handleLoginFromPing = URL => {
  return (dispatch, getState) => {
    const { user } = getState()
    const hashes = authClient.parseURL(URL)

    if (hashes.error && hashes.error_description) {
      const error = `${hashes.error}: ${hashes.error_description}`
      dispatch(LOGIN_ERROR({ message: error }))
      return
    }

    if (hashes.state && !equals(hashes.state, user.auth.state)) {
      dispatch(LOGIN_ERROR({ message: 'STATE_MISMATCH' }))
      return
    }

    if (hashes.code) {
      authClient
        .getAccessTokenOAuth(hashes.code)
        .then(token => {
          dispatch(handleUserProfile(token))
        })
        .catch(error => {
          dispatch(LOGIN_ERROR({ message: 'FETCH_ACCESS_TOKEN' }))
        })
    }
  }
}

const discardUserPropsFromAPIResponse = pipe(
  prop('data'),
  omit(['userId', 'displayName', 'email'])
)

const merge_EDP_PING_Response = useWith(merge, [
  discardUserPropsFromAPIResponse,
  identity
])

const buildUser = converge(merge_EDP_PING_Response, [head, last])

export const handleUserProfile = (tokenInfo = {}) => {
  return dispatch => {
    try {
      const { access_token } = tokenInfo
      Promise.all([
        httpGet('/auth/user', null, access_token),
        authClient.getUserInfoOAuth(access_token)
      ])
        .then(buildUser)
        .then(user => {
          const payload = { data: user, auth: tokenInfo }
          dispatch(LOGIN_SUCCESS(payload))
          dispatch(fetchInventory())
          dispatch(getFile())
        })
        .catch(error => {
          console.error(error)
          const details = prop('details', error)

          if (!details) {
            dispatch(LOGIN_ERROR({ message: 'HTTP_ERROR' }))
            return
          }

          const firstError = head(details)
          const firstErrorCode = prop('code', firstError)

          if (equals(firstErrorCode, 'INVALID_VALUE')) {
            const firstErrorMsg = prop('message', firstError)
            const ERROR = firstErrorMsg.includes('Access token expired')
              ? 'ACCESS_TOKEN_EXPIRED'
              : firstErrorMsg
            dispatch(LOGIN_ERROR({ message: ERROR }))
          } else {
            const description = prop('error_description', error)
            dispatch(LOGIN_ERROR({ message: description }))
          }
        })
    } catch (err) {
      dispatch(LOGIN_ERROR(err))
    }
  }
}

export const verifyToken = access_token => {
  return dispatch => {
    authClient
      .verifyTokenOAuth(access_token)
      .then(response => {
        if (!response.uniqueId) {
          dispatch(LOGIN_ERROR({ message: 'ACCESS_TOKEN_EXPIRED' }))
          dispatch(LOGOUT())
          return
        }
        dispatch(VALIDATE_SESSION_SUCCESS())
      })
      .catch(error => {
        dispatch(LOGIN_ERROR({ message: 'ACCESS_TOKEN_EXPIRED' }))
        dispatch(LOGOUT())
        dispatch(VALIDATE_SESSION_ERROR())
      })
  }
}

export const VALIDATE_SESSION_INIT = createAction('VALIDATE_SESSION_INIT')
export const VALIDATE_SESSION_SUCCESS = createAction('VALIDATE_SESSION_SUCCESS')
export const VALIDATE_SESSION_ERROR = createAction('VALIDATE_SESSION_ERROR')

export const validateSession = () => {
  return (dispatch, getState) => {
    const { user } = getState()
    if (user.auth.access_token) {
      dispatch(VALIDATE_SESSION_INIT())
      dispatch(verifyToken(user.auth.access_token))
    }
  }
}
