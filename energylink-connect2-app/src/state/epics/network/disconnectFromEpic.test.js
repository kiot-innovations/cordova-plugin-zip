import { of } from 'rxjs'

import {
  PVS_CONNECTION_CLOSE,
  PVS_CONNECTION_CLOSE_FINISHED
} from 'state/actions/network'

describe('Disconnect from PVS epic', () => {
  let disconnectFromEpic
  let epicTest
  const androidConnect = jest.fn().mockReturnValue('default')
  const connectedSSID = jest.fn().mockReturnValue('sunpower')
  beforeAll(() => {
    delete global.device
    delete global.WifiWizard2
  })

  beforeEach(() => {
    jest.resetModules()
    disconnectFromEpic = require('./disconnectFromEpic').default
    global.WifiWizard2 = {
      iOSDisconnectNetwork: jest.fn(() => of('success')),
      connect: androidConnect,
      getConnectedSSID: connectedSSID,
      disable: jest.fn(() => of('success'))
    }

    epicTest = epicTester(disconnectFromEpic)
  })

  it('dispatch PVS_CONNECTION_CLOSE_FINISHED connection success if received PVS_CONNECTION_CLOSE', () => {
    global.device = {
      platform: 'iOS'
    }

    const inputValues = {
      a: PVS_CONNECTION_CLOSE()
    }
    const expectedValues = {
      b: PVS_CONNECTION_CLOSE_FINISHED('success')
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
      network: { SSID: 'SunPower8888' }
    })
  })
})
