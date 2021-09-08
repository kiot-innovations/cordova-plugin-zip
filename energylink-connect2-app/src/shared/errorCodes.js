import { prop } from 'ramda'
import * as Sentry from 'sentry-cordova'

import ErrorCodesList from 'shared/errorCodesList.json'
import { arrayToObject } from 'shared/utils'

const unknownError = code => {
  Sentry.captureException(`Error code not found ${code}`)
  return null
}

export const keyedErrors = arrayToObject('event_code', ErrorCodesList)
export const getError = error => {
  const { error_code, error_message } = error
  const errorObj = prop(error_code, keyedErrors)
  //in case we found the error in the object above
  if (errorObj) return errorObj
  //in case there is an error message
  // for formatting reasons, will replace all _ to ' '
  else if (error_message)
    return { ...error, error_message: error_message.replace(/_/gm, ' ') }
  //in case error_message doesn't exist
  return unknownError(error_code)
}
export default ErrorCodesList
