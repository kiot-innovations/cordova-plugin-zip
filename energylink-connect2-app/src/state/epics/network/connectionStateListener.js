import { includes, isEmpty } from 'ramda'
import { ofType } from 'redux-observable'
import { of, EMPTY } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { SHOW_MODAL } from 'state/actions/modal'
import { SET_CONNECTION_STATUS } from 'state/actions/network'
import { appConnectionStatus } from 'state/reducers/network'

export const connectionStateListenerEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CONNECTION_STATUS.getType()),
    switchMap(({ payload }) =>
      includes(payload, [
        appConnectionStatus.NOT_USING_WIFI,
        appConnectionStatus.NOT_CONNECTED_PVS
      ]) && isEmpty(state$.value.network.err)
        ? of(
            SHOW_MODAL({
              componentPath: './ConnectionStatus/ConnectionStatusModal.jsx'
            })
          )
        : EMPTY
    )
  )
