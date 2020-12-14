import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY
} from 'state/actions/analytics'
import { scanPVS } from 'shared/analytics'

const enterSNManuallyEpic = action$ => {
  return action$.pipe(
    ofType(CONNECT_PVS_MANUALLY.getType()),
    map(({ payload }) =>
      scanPVS(
        { entryMethod: 'Manual', pvsSN: payload },
        'User entered PVS SN manually'
      )
    )
  )
}

const scanPVSCameraEpic = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_CAMERA.getType()),
    map(({ payload }) =>
      scanPVS(
        {
          entryMethod: 'QR Code',
          pvsSN: payload
        },
        'User entered PVS SN scanning a QR code'
      )
    )
  )

export default [enterSNManuallyEpic, scanPVSCameraEpic]
