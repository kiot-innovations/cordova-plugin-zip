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

import { pvs5FwupStages, pvs6FwupStages, isPvs5 } from 'shared/utils'
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

const updateAlmostFinished = state$ => {
  const { status } = state$.value.firmwareUpdate

  return isPvs5(state$)
    ? includes(status, [
        pvs5FwupStages[1],
        pvs5FwupStages[2],
        pvs5FwupStages[3]
      ])
    : includes(status, [
        pvs6FwupStages[3],
        pvs6FwupStages[4],
        pvs6FwupStages[5],
        pvs6FwupStages[6]
      ])
}

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
