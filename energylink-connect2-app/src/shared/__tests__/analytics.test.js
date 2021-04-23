import { commissionSite, setACModuleType } from 'shared/analytics'

describe('The analytics file to register actions to mixpanel', () => {
  const mixpanelMock = {
    track: jest.fn(),
    unregister: jest.fn()
  }
  beforeEach(() => {
    jest.resetModules()
    mixpanelMock.track = jest.fn()
    mixpanelMock.unregister = jest.fn()
    window.mixpanel = mixpanelMock
  })

  it('should register the commission Site event', () => {
    commissionSite({ duration: 100, timeConfiguring: 50 })
    expect(mixpanelMock.track).toBeCalledTimes(1)
    expect(mixpanelMock.track).toBeCalledWith('Commission Site', {
      $duration: 100,
      'Time Configuring': 50
    })
    expect(mixpanelMock.unregister).toBeCalledTimes(1)
    expect(mixpanelMock.unregister).toBeCalledWith('PVS SN')
  })

  describe('The set AC module type', () => {
    it('should register the event if it timeElapsed parameter', () => {
      setACModuleType({ timeElapsed: 100, moduleTypes: ['A', 'B', 'C'] })
      expect(mixpanelMock.track).toBeCalledWith('Set AC Module Type', {
        success: true,
        $duration: 100,
        moduleTypes: ['A', 'B', 'C']
      })
      expect(mixpanelMock.track).toBeCalledTimes(1)
    })

    it('should register the event if it has the errorCodes parameter', () => {
      setACModuleType({ errorCodes: ['123', '456'] })
      expect(mixpanelMock.track).toBeCalledWith('Set AC Module Type', {
        errorCodes: ['123', '456'],
        success: false
      })
      expect(mixpanelMock.track).toBeCalledTimes(1)
    })
  })
})
