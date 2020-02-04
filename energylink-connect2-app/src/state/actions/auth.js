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
import { getFile } from './fileDownloader'
import authClient from 'shared/auth/sdk'
import { httpGet } from 'shared/fetch'

export const LOGIN_INIT = createAction('LOGIN_INIT')
export const LOGIN_SUCCESS = createAction('LOGIN_SUCCESS')
export const LOGIN_ERROR = createAction('LOGIN_ERROR')
export const LOGOUT = createAction('LOGOUT')

const ROLES = {
  PARTNER: 'partner',
  PARTNER_PRO: 'partner_pro'
}

export const requestLogin = () => {
  return (dispatch, state) => {
    try {
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
          const ug = user.userGroup.toLowerCase()
          if (ug !== ROLES.PARTNER && ug !== ROLES.PARTNER_PRO) {
            dispatch(LOGIN_ERROR({ message: 'INVALID_ROLE' }))
          } else {
            dispatch(LOGIN_SUCCESS(payload))
            //dispatch(fetchInventory())
            dispatch(getFile())
          }
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
