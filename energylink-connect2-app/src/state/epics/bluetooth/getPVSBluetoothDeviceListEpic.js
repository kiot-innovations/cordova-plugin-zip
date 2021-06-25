import { ofType } from 'redux-observable'
import { catchError, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import {
  BLE_GET_DEVICES,
  BLE_GET_DEVICES_ENDED,
  BLE_GET_DEVICES_ERROR,
  BLE_UPDATE_DEVICES
} from 'state/actions/network'
import { getBLEDeviceList } from 'shared/bluetooth/getBluetoothDeviceList'
import { isPVSDevice } from 'shared/utils'
import { EMPTY_ACTION } from '../../actions/share'

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
