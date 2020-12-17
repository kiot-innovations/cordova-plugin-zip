import { trace } from 'shared/utils'

export const enableAccessPointOnPVS = bleConnectionInfo =>
  new Promise(resolve => {
    const spwr = new window.sunpowerble.SunpowerBle()
    spwr.setupPin('1234')
    new window.sunpowerble.Endpoints.Communication.APEnable.Post()
      .send(bleConnectionInfo.id)
      .then(() => {
        window.ble.disconnect(
          bleConnectionInfo.id,
          trace('DISCONNECT_SUCCESS'),
          trace('DISCONNECT_ERROR')
        )
        resolve('ENABLE_AP_CMD_SENT')
      })
      .catch(() => {
        /*
          resolves because even tho it succeeded
          the PVS response cannot be read :
          BleError: Response length is incorrect. 552 instead of 512
        */
        window.ble.disconnect(
          bleConnectionInfo.id,
          trace('DISCONNECT_SUCCESS'),
          trace('DISCONNECT_ERROR')
        )
        resolve('ENABLE_AP_CMD_SENT')
      })
  })
