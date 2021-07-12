import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import { isIos } from 'shared/utils'
import {
  PVS_CONNECTION_CLOSE,
  PVS_CONNECTION_CLOSE_FINISHED
} from 'state/actions/network'

const disconnectFromPVS = ssid =>
  isIos
    ? window.WifiWizard2.iOSDisconnectNetwork(ssid)
    : window.WifiWizard2.disable(ssid)

const disconnectFromPVSEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_CLOSE.getType()),
    exhaustMap(action => {
      const ssid = pathOr('', ['value', 'network', 'SSID'], state$)
      return from(disconnectFromPVS(ssid)).pipe(
        map(PVS_CONNECTION_CLOSE_FINISHED),
        catchError(err => of(PVS_CONNECTION_CLOSE_FINISHED.asError(err)))
      )
    })
  )

export default disconnectFromPVSEpic
