import { of } from 'rxjs'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS
} from 'state/actions/network'
import { networkPollingEpic } from 'state/epics/network/networkEpic'

describe('The network epic tests', () => {
  let timesPolled
  let success
  let action$
  let state$
  let epic$
  const init = PVS_CONNECTION_SUCCESS()
  const state = {
    network: {
      SSID: 'sunPower',
      password: '123456'
    }
  }
  beforeAll(() => {
    delete global.WifiWizard2
  })
  beforeEach(() => {
    success = { type: 'DEVICE_IS_CONNECTED' }
    action$ = of(init)
    state$ = of(state)
    epic$ = networkPollingEpic(action$, state$)
  })
  it('should start polling when PVS_CONNECTION_SUCCESS is dispatched', done => {
    const maxTimes = 3
    let times = 0
    timesPolled = jest
      .fn()
      .mockResolvedValueOnce('sunPower')
      .mockResolvedValueOnce('sunPower')
      .mockResolvedValueOnce('sunPower')
      .mockRejectedValueOnce('I failed')
    global.WifiWizard2 = {
      getConnectedSSID: timesPolled
    }
    epic$.subscribe(action => {
      times += 1
      expect(timesPolled).toBeCalledTimes(times)
      expect(action).toStrictEqual(success)
      if (times === maxTimes) done()
    })
  })
  it('should ask to reconnect once the pvs is disconnected', done => {
    timesPolled = jest.fn().mockRejectedValue('I failed')
    global.WifiWizard2 = {
      getConnectedSSID: timesPolled
    }
    epic$.subscribe(action => {
      expect(timesPolled).toBeCalledTimes(1)
      expect(action).toStrictEqual(
        PVS_CONNECTION_INIT({
          ssid: state.network.SSID,
          password: state.network.password
        })
      )
      done()
    })
  })
})
