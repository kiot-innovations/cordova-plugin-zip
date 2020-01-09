import { of } from 'rxjs'
import { DISCOVER_INIT, DISCOVER_UPDATE } from 'state/actions/devices'
import scanDevicesEpic from 'state/epics/devices/discoverDevices'
import * as apis from 'shared/api'

describe('the discover device epic', () => {
  let action
  let action$
  let epic$
  let mockStartDiscovery
  let mockGetProgress
  let payload
  let update
  beforeEach(() => {
    action = DISCOVER_INIT()
    action$ = of(action)
    epic$ = scanDevicesEpic(action$)
    payload = [{ TYPE: 'Inverter', NFOUND: 10 }]
    update = DISCOVER_UPDATE(payload)
    mockStartDiscovery = jest.fn()
    mockGetProgress = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          complete: false,
          progress: payload
        }
      })
      .mockResolvedValue({
        data: {
          complete: true,
          progress: payload
        }
      })

    jest.spyOn(apis, 'getApiPVS').mockImplementation(() => {
      return {
        apis: {
          discovery: {
            getDiscoveryProgress: mockGetProgress,
            startDiscovery: mockStartDiscovery
          }
        }
      }
    })
  })

  it('should update the data once its completed', done => {
    epic$.subscribe(returnedAction => {
      if (returnedAction.type === update.type) {
        expect(returnedAction.payload).toBe(payload)
        expect(mockGetProgress).toBeCalledTimes(1)
      } else {
        expect(returnedAction.payload).toBe(payload)
        expect(mockGetProgress).toBeCalledTimes(2)
        expect(mockStartDiscovery).toBeCalledTimes(1)
        done()
      }
    })
  })
})
