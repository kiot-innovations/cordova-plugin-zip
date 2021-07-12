import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import { EMPTY_ACTION } from '../../actions/share'

import { getBLEDeviceList } from 'shared/bluetooth/getBluetoothDeviceList'
import { isPVSDevice } from 'shared/utils'
import {
  BLE_GET_DEVICES,
  BLE_GET_DEVICES_ENDED,
  BLE_GET_DEVICES_ERROR,
  BLE_UPDATE_DEVICES
} from 'state/actions/network'

export const getBLEDeviceListEpic = action$ =>
  action$.pipe(
    ofType(BLE_GET_DEVICES.getType()),
    switchMap(() =>
      getBLEDeviceList().pipe(
        map(({ device, ended }) =>
          ended
            ? BLE_GET_DEVICES_ENDED()
            : isPVSDevice(device)
            ? BLE_UPDATE_DEVICES(device)
            : EMPTY_ACTION()
        ),
        catchError(error => of(BLE_GET_DEVICES_ERROR(error)))
      )
    )
  )
