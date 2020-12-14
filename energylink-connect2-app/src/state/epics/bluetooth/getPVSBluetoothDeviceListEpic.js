import { ofType } from 'redux-observable'
import { catchError, map, switchMap, filter } from 'rxjs/operators'
import { of } from 'rxjs'
import {
  BLE_GET_DEVICES,
  BLE_GET_DEVICES_ERROR,
  BLE_UPDATE_DEVICES
} from 'state/actions/network'
import { getBLEDeviceList } from 'shared/bluetooth/getBluetoothDeviceList'
import { isPVSDevice } from 'shared/utils'

export const getBLEDeviceListEpic = action$ =>
  action$.pipe(
    ofType(BLE_GET_DEVICES.getType()),
    switchMap(() =>
      getBLEDeviceList().pipe(
        filter(isPVSDevice),
        map(BLE_UPDATE_DEVICES),
        catchError(error => of(BLE_GET_DEVICES_ERROR(error)))
      )
    )
  )
