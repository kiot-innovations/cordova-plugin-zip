import { createAction } from 'redux-act'
import { getUser } from './user'
import { httpPost, httpDelete, httpGet } from '../../shared/fetch'
import { trimObject } from '../../shared/trim'

export const WORKFLOW_TYPES = {
  SELF: 1,
  THIRD_PARTY: 2,
  INSTALLER: 3
}

export const LOGIN_INIT = createAction('LOGIN_INIT')
export const LOGIN_SUCCESS = createAction('LOGIN_SUCCESS')
export const LOGIN_ERROR = createAction('LOGIN_ERROR')

export const performLogin = values => {
  return async dispatch => {
    try {
      dispatch(LOGIN_INIT())
      const response = await httpPost('/authenticate', values)
      if (response.status !== 200) {
        dispatch(LOGIN_ERROR(response))
        return
      }
      dispatch(LOGIN_SUCCESS(response.data))
      dispatch(getUser())
    } catch (err) {
      dispatch(LOGIN_ERROR(err))
    }
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

export const LOGOUT = createAction('LOGOUT')

export const logout = () => {
  return async (dispatch, getState) => {
    const state = getState()
    await httpDelete('/session', state)
    dispatch(LOGOUT())
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
        performLogin(
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
  return async (dispatch, getState) => {
    try {
      const state = getState()
      dispatch(VALIDATE_SESSION_INIT())
      const response = await httpGet('/session', state)
      if (response.status !== 200) {
        dispatch(VALIDATE_SESSION_ERROR(response))
        dispatch(LOGOUT())
        return
      }
      dispatch(VALIDATE_SESSION_SUCCESS())
    } catch (err) {
      dispatch(VALIDATE_SESSION_ERROR(err))
    }
  }
}
