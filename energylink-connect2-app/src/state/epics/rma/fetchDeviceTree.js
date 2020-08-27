import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { path } from 'ramda'
import {
  FETCH_DEVICE_TREE,
  FETCH_DEVICE_TREE_SUCCESS,
  FETCH_DEVICE_TREE_ERROR
} from 'state/actions/rma'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getSelectedPVS = path(['rma', 'pvs'])

export const fetchDeviceTreeEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_DEVICE_TREE.getType()),
    exhaustMap(() => {
      const promise = getApiDevice(getAccessToken(state$.value))
        .then(path(['apis', 'device']))
        .then(api =>
          api.deviceGetTreeByDeviceId({
            deviceid: getSelectedPVS(state$.value)
          })
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? FETCH_DEVICE_TREE_SUCCESS(response.body.items)
            : FETCH_DEVICE_TREE_ERROR('FETCH_DEVICE_TREE_ERROR')
        ),
        catchError(err => {
          Sentry.captureException(err)
        })
      )
    })
  )
}