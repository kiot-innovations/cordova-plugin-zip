import { compose, includes, isEmpty, pathEq, pathOr, split } from 'ramda'
import { ofType } from 'redux-observable'
import { of, EMPTY } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { stagesFromThePvs } from 'shared/utils'
import { SHOW_MODAL } from 'state/actions/modal'
import { SET_CONNECTION_STATUS } from 'state/actions/network'
import { appConnectionStatus } from 'state/reducers/network'

const isSelectingPVS = compose(
  pathEq(['1'], '/pvs-selection'),
  split('#'),
  pathOr('url#/page', ['location', 'href'])
)

export const connectionStateListenerEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CONNECTION_STATUS.getType()),
    switchMap(({ payload }) =>
      includes(payload, [
        appConnectionStatus.NOT_USING_WIFI,
        appConnectionStatus.NOT_CONNECTED_PVS
      ]) &&
      isEmpty(state$.value.network.err) &&
      !isSelectingPVS(window) &&
      state$.value.firmwareUpdate.status !== stagesFromThePvs[3]
        ? of(
            SHOW_MODAL({
              componentPath: './ConnectionStatus/ConnectionStatusModal.jsx'
            })
          )
        : EMPTY
    )
  )
