import * as Sentry from '@sentry/browser'
import { path, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, catchError, exhaustMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { getEnvironment, TAGS } from 'shared/utils'
import {
  FETCH_PCS_SETTINGS_ERROR,
  FETCH_PCS_SETTINGS_INIT,
  FETCH_PCS_SETTINGS_SUCCESS
} from 'state/actions/pcs'

const promise = () =>
  getApiPVS()
    .then(path(['apis', 'esmm']))
    .then(api => api.getPCSSettings())

const buildResponse = responseBody => {
  if (responseBody.result !== 'Success' || !responseBody.Settings)
    throw new Error('ERROR_FETCHING_PCS_SETTINGS')

  const {
    main_service_panel_busbar,
    main_service_panel_breaker,
    hubplus_busbar,
    hubplus_breaker,
    enable_pcs
  } = responseBody.Settings

  return {
    busBarRating: main_service_panel_busbar,
    breakerRating: main_service_panel_breaker,
    hubPlusBreakerRating: hubplus_breaker,
    hubPlusBusBarRating: hubplus_busbar,
    enablePCS: enable_pcs
  }
}

// PCS = Power Control System
export const getPCSSettingsEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_PCS_SETTINGS_INIT.getType()),
    exhaustMap(() =>
      from(promise()).pipe(
        map(prop('body')),
        map(buildResponse),
        map(FETCH_PCS_SETTINGS_SUCCESS),
        catchError(error => {
          Sentry.addBreadcrumb({
            data: {
              path: window.location.hash,
              environment: getEnvironment()
            },
            message: error.message,
            level: Sentry.Severity.Error
          })
          Sentry.setTag(TAGS.KEY.PCS, TAGS.VALUE.GET_PCS_SETTINGS_ERROR)
          Sentry.captureException(error)
          return of(FETCH_PCS_SETTINGS_ERROR(error.message))
        })
      )
    )
  )
}
