import { PVS_CONNECTION_INIT, WAIT_FOR_SWAGGER } from 'state/actions/network'
import { of } from 'rxjs'

describe('Connect to epic', () => {
  let connectToEpic
  let iosConnect = jest.fn().mockReturnValue('default')
  const androidConnect = jest.fn().mockReturnValue('default')
  beforeAll(() => {
    delete global.device
    delete global.WifiWizard2
  })

  beforeEach(() => {
    jest.resetModules()
    connectToEpic = require('./connectToEpic').default
    global.WifiWizard2 = {
      iOSConnectNetwork: iosConnect,
      connect: androidConnect
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
  it('should retry if connection failed', done => {
    global.device = {
      platform: 'android'
    }
    const failFn = jest.fn().mockRejectedValueOnce('user failed to connect')
    global.WifiWizard2 = {
      connect: failFn
    }
    const init = PVS_CONNECTION_INIT({ ssid: 'sunpower', password: '123456' })
    const action$ = of(init)
    const epic$ = connectToEpic(action$)
    epic$.subscribe(action => {
      expect(action).toStrictEqual(init)
      done()
    })
  })
})
