import {
  anyPass,
  compose,
  includes,
  isEmpty,
  pathEq,
  pathOr,
  split
} from 'ramda'
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

const notConnected = payload =>
  includes(payload, [
    appConnectionStatus.NOT_USING_WIFI,
    appConnectionStatus.NOT_CONNECTED_PVS
  ])

const noNetworkError = state$ => isEmpty(state$.value.network.err)

const notSelectingPVS = !isSelectingPVS(window)

const isNotUpdating = state$ => state$.value.firmwareUpdate.upgrading === false

const updateAlmostFinished = state$ =>
  includes(state$.value.firmwareUpdate.status, [
    stagesFromThePvs[3],
    stagesFromThePvs[4],
    stagesFromThePvs[5],
    stagesFromThePvs[6]
  ])

const showReconnectionModalOn = anyPass([
  noNetworkError,
  notSelectingPVS,
  isNotUpdating
])

export const connectionStateListenerEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CONNECTION_STATUS.getType()),
    switchMap(({ payload }) => {
      return notConnected(payload) &&
        showReconnectionModalOn(state$) &&
        !updateAlmostFinished(state$)
        ? of(
            SHOW_MODAL({
              componentPath: './ConnectionStatus/ConnectionStatusModal.jsx'
            })
          )
        : EMPTY
    })
  )
