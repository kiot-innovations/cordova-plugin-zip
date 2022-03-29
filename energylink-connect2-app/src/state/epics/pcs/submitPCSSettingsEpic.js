import * as Sentry from '@sentry/browser'
import { path, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, catchError, exhaustMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { getEnvironment, TAGS } from 'shared/utils'
import {
  SUBMIT_PCS_SETTINGS_ERROR,
  SUBMIT_PCS_SETTINGS_INIT,
  SUBMIT_PCS_SETTINGS_SUCCESS
} from 'state/actions/pcs'

const buildPayload = (payload = { Settings: {} }) => ({
  Settings: {
    main_service_panel_busbar: payload.busBarRating,
    main_service_panel_breaker: payload.breakerRating,
    hubplus_breaker: payload.hubPlusBreakerRating,
    hubplus_busbar: 200,
    enable_pcs: payload.enablePCS
  }
})

const promise = requestBody =>
  getApiPVS()
    .then(path(['apis', 'esmm']))
    .then(api => api.setPCSSettings({ id: 1 }, { requestBody }))

// PCS = Power Control System
export const submitPCSSettingsEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_PCS_SETTINGS_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(promise(buildPayload(payload))).pipe(
        map(prop('body')),
        map(SUBMIT_PCS_SETTINGS_SUCCESS),
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
          return of(SUBMIT_PCS_SETTINGS_ERROR(error.message))
        })
      )
    )
  )
}
