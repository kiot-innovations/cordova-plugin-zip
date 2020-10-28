import { trace } from 'shared/utils'

export const enableAccessPointOnPVS = bleConnectionInfo =>
  new Promise(resolve => {
    const spwr = new window.sunpowerble.SunpowerBle()
    spwr.setupPin('1234')

    console.info(
      'isEncryptionRequired',
      spwr.isEncryptionRequired(bleConnectionInfo)
    )

    new window.sunpowerble.Endpoints.Communication.APEnable.Post()
      .send(bleConnectionInfo.id)
      .then(() => {
        resolve('ENABLE_AP_CMD_SENT')
      })
      .catch(error => {
        console.error({ error })
        /*
          resolves because even tho it succeeded
          the PVS response cannot be read :
          BleError: Response length is incorrect. 552 instead of 512
        */
        window.ble.disconnect(
          bleConnectionInfo.id,
          trace('succesfully disconnected'),
          trace('error disconnecting')
        )

        resolve('ENABLE_AP_CMD_SENT')
      })
  })
