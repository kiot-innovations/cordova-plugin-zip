import {
  __,
  assoc,
  assocPath,
  compose,
  concat,
  curry,
  includes,
  isEmpty,
  path,
  pathOr,
  prop,
  propOr
} from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import paths from 'routes/paths'
import { getApiDevice, getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { edpErrorMessage } from 'shared/utils'
import {
  SUBMIT_COMMISSION_INIT,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_STRING_INVERTERS_INIT,
  SUBMIT_CONFIG_SUCCESS
} from 'state/actions/systemConfiguration'

const pvsIsOffline = message =>
  includes('Errno 101', message) || includes('Errno -2', message)

const assignMeta = compose(
  assocPath(['meta', 'checksum'], 'disable'),
  assocPath(['meta', 'meta'], 'v2')
)

const assignSite = curry((state, config) =>
  compose(
    assocPath(['site', 'siteKey'], path(['site', 'site', 'siteKey'], state))
  )(config)
)

const assignPvs = assocPath(['pvs', 'systemSize'], -1)

const assignDevices = assoc('devices', __, {})

const assignLogger = curry((state, devices) =>
  concat(
    [
      {
        type: 'LOGGER',
        operation: 'COMM',
        serialNumber: path(['pvs', 'serialNumber'], state),
        productModelName: concat(
          'PV Supervisor ',
          path(['pvs', 'model'], state)
        )
      }
    ],
    devices
  )
)

const buildConfigObject = (state, devices) =>
  compose(
    assignPvs,
    assignMeta,
    assignSite(state),
    assignDevices,
    assignLogger(state)
  )(devices)

export const submitConfigSuccessEpic = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_CONFIG_SUCCESS.getType()),
    map(() =>
      isEmpty(pathOr([], ['value', 'stringInverters', 'newDevices'], state$))
        ? SUBMIT_COMMISSION_INIT()
        : SUBMIT_STRING_INVERTERS_INIT()
    )
  )

export const submitStringInvertersEpic = (action$, state$) => {
  const t = translate()
  return action$.pipe(
    ofType(SUBMIT_STRING_INVERTERS_INIT.getType()),
    switchMap(() => {
      const stringInverters = path(
        ['stringInverters', 'newDevices'],
        state$.value
      )

      const accessToken = path(['user', 'auth', 'access_token'], state$.value)
      const saveToEDPStringInverters = getApiDevice(accessToken)
        .then(path(['apis', 'commission']))
        .then(api =>
          api.devicePostCommissionConfig(
            { id: 1 },
            { requestBody: buildConfigObject(state$.value, stringInverters) }
          )
        )

      return from(saveToEDPStringInverters).pipe(
        map(SUBMIT_COMMISSION_INIT),
        catchError(err => {
          Sentry.captureException(err)
          const apiResult = pathOr({}, ['response', 'body', 'result'], err)
          const message = propOr('', 'message', apiResult)
          const error = pvsIsOffline(message)
            ? t('COMMISSION_ERROR_NO_INTERNET')
            : edpErrorMessage(apiResult)
          return of(
            SUBMIT_COMMISSION_ERROR({
              error,
              goTo: paths.PROTECTED.ADD_STRING_INVERTERS.path
            })
          )
        })
      )
    })
  )
}

export const submitConfigObjectEpic = (action$, state$) => {
  return action$.pipe(
    ofType(SUBMIT_COMMISSION_INIT.getType()),
    mergeMap(() => {
      const t = translate()
      const promise = getApiPVS()
        .then(path(['apis', 'commission']))
        .then(api => api.sendConfig({ id: 1 }, { requestBody: {} }))

      return from(promise).pipe(
        map(prop('result')),
        map(SUBMIT_COMMISSION_SUCCESS),
        catchError(error => {
          const apiResult = pathOr({}, ['response', 'body', 'result'], error)
          const pvsSn = state$.value.pvs.serialNumber
          const message = propOr('Unknown message', 'message', apiResult)

          const data = {
            pvsSerialNumber: pvsSn,
            code: propOr('Unknown code', 'code', apiResult),
            message,
            exception: propOr('Unknown exception', 'exception', apiResult)
          }

          const text = pvsIsOffline(message)
            ? t('COMMISSION_ERROR_NO_INTERNET')
            : edpErrorMessage(apiResult)

          Sentry.addBreadcrumb({
            data,
            message: t('COMMISSIONING_ERROR'),
            type: 'error',
            category: 'error',
            level: 'error'
          })

          Sentry.captureMessage(text)
          Sentry.captureException(error)
          return of(SUBMIT_COMMISSION_ERROR(data))
        })
      )
    })
  )
}
