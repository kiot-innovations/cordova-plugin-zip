import { ofType } from 'redux-observable'
import { DEVICE_READY, DEVICE_RESUME } from 'state/actions/mobile'
import { catchError, map, switchMap } from 'rxjs/operators'
import { compose, last, split } from 'ramda'
import { deviceResume, internetConnection } from 'shared/analytics'
import {
  PVS_CONNECTION_ERROR,
  PVS_CONNECTION_SUCCESS
} from 'state/actions/network'
import { from, of } from 'rxjs'
import { sendCommandToPVS } from 'shared/PVSUtils'

const getAddress = compose(deviceResume, last, split('#'))

async function getConnectionState() {
  const networkState = navigator.connection.type
  const states = {
    [window.Connection.UNKNOWN]: 'Unknown',
    [window.Connection.ETHERNET]: 'Ethernet',
    [window.Connection.WIFI]: 'WiFi',
    [window.Connection.CELL_2G]: 'Cell 2G',
    [window.Connection.CELL_3G]: 'Cell 3G',
    [window.Connection.CELL_4G]: 'Cell 4G',
    [window.Connection.CELL]: 'Cell Generic',
    [window.Connection.NONE]: 'No Network'
  }
  if (networkState === window.Connection.WIFI) {
    //check if we're connected to the PVS
    try {
      await sendCommandToPVS('GetSupervisorInformation')
      return 'PVS'
    } catch (e) {
      return 'Customer WiFi'
    }
  }
  return states[networkState]
}

const resumeAppEpic = action$ =>
  action$.pipe(
    ofType(DEVICE_RESUME.getType(), DEVICE_READY.getType()),
    map(() => getAddress(window.location.hash))
  )

const checkWifiConnection = action$ =>
  action$.pipe(
    ofType(
      DEVICE_RESUME.getType(),
      DEVICE_READY.getType(),
      PVS_CONNECTION_SUCCESS.getType(),
      PVS_CONNECTION_ERROR.getType()
    ),
    switchMap(() =>
      from(getConnectionState()).pipe(
        map(internetConnection),
        catchError(() => of(internetConnection('Unknown')))
      )
    )
  )
export default [resumeAppEpic, checkWifiConnection]
