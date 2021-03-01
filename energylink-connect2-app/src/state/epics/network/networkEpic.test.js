/**
 *@jest-environment jsdom
 */
import { of } from 'rxjs'
import {
  PVS_CONNECTION_SUCCESS,
  SET_CONNECTION_STATUS
} from 'state/actions/network'
import { networkPollingEpic } from 'state/epics/network/networkEpic'
import { appConnectionStatus } from 'state/reducers/network'

describe('The network epic tests', () => {
  let timesPolled
  let action$
  let state$
  let epic$
  const init = PVS_CONNECTION_SUCCESS()
  beforeAll(() => {
    delete global.WifiWizard2
  })
  beforeEach(() => {
    action$ = of(init)
  })
  it('should start polling when PVS_CONNECTION_SUCCESS is dispatched', done => {
    Object.defineProperty(
      window.navigator,
      'connection',
      (function() {
        return {
          get: function _get() {
            return { type: 'wifi' }
          },
          set: function _set() {
            return { type: 'wifi' }
          }
        }
      })(window.navigator.connection)
    )

    const state = {
      network: {
        SSID: 'sunPower',
        password: '123456',
        connectionStatus: appConnectionStatus.CONNECTED
      },
      fileDownloader: {
        progress: {
          downloading: true
        }
      }
    }

    state$ = of(state)
    epic$ = networkPollingEpic(action$, state$)

    const maxTimes = 3
    let times = 0
    timesPolled = jest
      .fn()
      .mockResolvedValueOnce('sunPower')
      .mockResolvedValueOnce('sunPower')
      .mockResolvedValueOnce('sunPower')
      .mockRejectedValueOnce('I failed')
    window.Navigator = {
      connection: {
        type: 'wifi'
      }
    }
    global.WifiWizard2 = {
      getConnectedSSID: timesPolled
    }
    epic$.subscribe(() => {
      times += 1
      expect(timesPolled).toBeCalled()
      if (times === maxTimes) done()
    })
  })
  it('should set connection status to NOT_CONNECTED_PVS once the pvs is disconnected', done => {
    const state = {
      network: {
        SSID: 'sunPower',
        password: '123456',
        connectionStatus: appConnectionStatus.CONNECTED
      },
      fileDownloader: {
        progress: {
          downloading: true
        }
      }
    }

    state$ = of(state)
    epic$ = networkPollingEpic(action$, state$)

    timesPolled = jest.fn().mockRejectedValue('I failed')
    global.WifiWizard2 = {
      getConnectedSSID: timesPolled
    }
    epic$.subscribe(action => {
      expect(timesPolled).toBeCalledTimes(1)
      expect(action).toStrictEqual(
        SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
      )
      done()
    })
  })
})
