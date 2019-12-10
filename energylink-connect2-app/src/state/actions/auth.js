import { createAction } from 'redux-act'
import { equals, head, prop, propOr } from 'ramda'
import { httpPost, httpGet } from '../../shared/fetch'
import { trimObject } from '../../shared/trim'
import { fetchInventory } from './inventory'
import { getFile } from './fileDownloader'
import authClient from 'shared/auth/sdk'

export const WORKFLOW_TYPES = {
  SELF: 1,
  THIRD_PARTY: 2,
  INSTALLER: 3
}

export const LOGIN_INIT = createAction('LOGIN_INIT')
export const LOGIN_SUCCESS = createAction('LOGIN_SUCCESS')
export const LOGIN_ERROR = createAction('LOGIN_ERROR')
export const SET_TOKEN = createAction('SET_TOKEN')
export const LOGOUT = createAction('LOGOUT')

export const requestLogin = () => {
  return dispatch => {
    try {
      let state = authClient.generateRandomValue()
      let nonce = authClient.generateRandomValue()

      dispatch(LOGIN_INIT({ state, nonce }))
      /// this triggers Ping auth service
      authClient.authorize(state, nonce)
    } catch (err) {
      dispatch(LOGIN_ERROR({ message: err }))
    }
  }
}

export const handleLoginFromPing = URL => {
  return (dispatch, getState) => {
    const { user } = getState()
    const hashes = authClient.parseHash(URL)

    if (hashes.error && hashes.error_description) {
      const error = `${hashes.error}: ${hashes.error_description}`
      dispatch(LOGIN_ERROR({ message: error }))
      return
    }

    const [, stateMatch] = URL.match('[?#&]state=([^&]*)') || []
    if (stateMatch && !equals(stateMatch, user.auth.state)) {
      dispatch(LOGIN_ERROR({ message: 'State parameter mismatch' }))
      return
    }

    const [, codeMatch] = URL.match('[?#&]code=([^&]*)') || []
    if (hashes.access_token) {
      dispatch(handleUserProfile(hashes.access_token))
    } else if (codeMatch) {
      authClient
        .getAccessToken(codeMatch)
        .then(token => {
          dispatch(handleUserProfile(token.access_token, token.id_token))
        })
        .catch(error => {
          dispatch(LOGIN_ERROR({ message: 'Could not get access token' }))
        })
    }

    if (hashes.id_token) {
      dispatch(verifyToken(hashes.id_token))
    }
  }
}

export const handleUserProfile = (access_token, id_token) => {
  return dispatch => {
    try {
      authClient
        .getUserInfo(access_token)
        .then(user => {
          const payload = { data: user, auth: { access_token } }
          dispatch(LOGIN_SUCCESS(payload))
          dispatch(fetchInventory())
          dispatch(getFile())
          if (id_token) {
            dispatch(SET_TOKEN(id_token))
          }
        })
        .catch(error => {
          const details = propOr([], 'details', error)
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

export const verifyToken = id_token => {
  return (dispatch, getState) => {
    const { user } = getState()
    authClient
      .verifyIdToken(id_token, {
        nonce: user.auth.nonce
      })
      .catch(error => {
        dispatch(LOGIN_ERROR({ message: 'INVALID_TOKEN' }))
        dispatch(LOGOUT())
      })
  }
}

export const logout = () => {
  return (dispatch, getState) => {
    const { user } = getState()
    authClient.signOff(user.auth.id_token, user.auth.state)
  }
}

export const CREATE_ACCOUNT_INIT = createAction('CREATE_ACCOUNT_INIT')
export const CREATE_ACCOUNT_SUCCESS = createAction('CREATE_ACCOUNT_SUCCESS')
export const CREATE_ACCOUNT_ERROR = createAction('CREATE_ACCOUNT_ERROR')

export const createAccount = values => {
  return async dispatch => {
    try {
      dispatch(CREATE_ACCOUNT_INIT())
      const response = await httpPost('/register/createAccount', {
        EmailAddress: values.email,
        FirstName: values.name.substr(0, values.name.indexOf(' ')),
        LastName: values.name.substr(values.name.indexOf(' ')),
        Password: values.password,
        Phone: values.phoneNumber,
        SerialNumber: values.serial,
        AddressID: values.addressId,
        TermsAgree: values.termsAgree
      })
      return response.status === 200
        ? dispatch(CREATE_ACCOUNT_SUCCESS(response.data))
        : dispatch(CREATE_ACCOUNT_ERROR(response))
    } catch (err) {
      dispatch(CREATE_ACCOUNT_ERROR(err))
    }
  }
}

export const sendResetPasswordEmail = async email => {
  return httpGet(`/passwordreset/sendPasswordResetEmail?emailaddress=${email}`)
}

export const validatePackage = async pkg => {
  return httpGet(`/passwordreset/validatePackage?package=${pkg}`)
}

export const RESET_PASSWORD_INIT = createAction('RESET_PASSWORD_INIT')
export const RESET_PASSWORD_SUCCESS = createAction('RESET_PASSWORD_SUCCESS')
export const RESET_PASSWORD_ERROR = createAction('RESET_PASSWORD_ERROR')

export const resetPassword = (values, pkg) => {
  return async dispatch => {
    try {
      dispatch(RESET_PASSWORD_INIT())
      const payload = {
        ConfirmEmailAddress: values.email,
        NewPassword: values.password,
        package: pkg,
        TermsAgree: values.termsAgree
      }
      const response = await httpPost(
        '/passwordreset/resetPassword',
        trimObject(payload)
      )
      if (response.status !== 200) {
        dispatch(RESET_PASSWORD_ERROR(response))
        return
      }
      dispatch(RESET_PASSWORD_SUCCESS())
      dispatch(
        requestLogin(
          trimObject({
            username: values.email,
            password: values.password
          })
        )
      )
    } catch (err) {
      dispatch(RESET_PASSWORD_ERROR(err))
    }
  }
}

export const checkEmail = async email => {
  return httpPost(`/register/checkEmail`, {
    EmailAddress: email,
    WorkflowType: WORKFLOW_TYPES.SELF
  })
}

export const validateSerial = async serial => {
  return httpGet(`/register/validateSerial/${serial}`)
}

export const VALIDATE_SESSION_INIT = createAction('VALIDATE_SESSION_INIT')
export const VALIDATE_SESSION_SUCCESS = createAction('VALIDATE_SESSION_SUCCESS')
export const VALIDATE_SESSION_ERROR = createAction('VALIDATE_SESSION_ERROR')

export const validateSession = () => {
  return (dispatch, getState) => {
    const { user } = getState()
    if (user.auth.id_token) {
      dispatch(verifyToken(user.auth.id_token))
    }
  }
}
