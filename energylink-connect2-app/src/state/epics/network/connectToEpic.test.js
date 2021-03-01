import {
  PVS_CONNECTION_INIT,
  WAIT_FOR_SWAGGER,
  SET_CONNECTION_STATUS
} from 'state/actions/network'
import { of } from 'rxjs'
import { appConnectionStatus } from 'state/reducers/network'

describe('Connect to epic', () => {
  let connectToEpic
  const iosConnect = jest.fn().mockReturnValue('default')
  const androidConnect = jest.fn().mockReturnValue('default')
  const connectedSSID = jest.fn().mockReturnValue('sunpower')
  beforeAll(() => {
    delete global.device
    delete global.WifiWizard2
  })

  beforeEach(() => {
    jest.resetModules()
    connectToEpic = require('./connectToEpic').default
    global.WifiWizard2 = {
      iOSConnectNetwork: iosConnect,
      connect: androidConnect,
      getConnectedSSID: connectedSSID
    }
  })

  it('dispatch PVS connection success if connection success on IOS', done => {
    global.device = {
      platform: 'iOS'
    }
    const init = PVS_CONNECTION_INIT({ ssid: 'sunpower', password: '123456' })
    const success = WAIT_FOR_SWAGGER()
    const action$ = of(init)
    const epic$ = connectToEpic(action$)
    epic$.subscribe(action => {
      expect(action).toStrictEqual(success)
      expect(iosConnect).toHaveBeenCalledTimes(1)
      done()
    })
  })
  it('should wait for swagger file if connection failed', done => {
    global.device = {
      platform: 'android'
    }
    const failFn = jest
      .fn()
      .mockRejectedValueOnce('ERROR_REQUESTED_NETWORK_UNAVAILABLE')
    global.WifiWizard2 = {
      connect: failFn
    }
    const init = PVS_CONNECTION_INIT({ ssid: 'sunpower', password: '123456' })
    const success = SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
    const action$ = of(init)
    const epic$ = connectToEpic(action$)
    epic$.subscribe(action => {
      expect(action).toStrictEqual(success)
      done()
    })
  })
})
