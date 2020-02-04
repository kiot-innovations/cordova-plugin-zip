import * as mobileActions from '../../actions/mobile'

describe('deviceReady Epic', () => {
  let epicTest
  let openSpy
  let fromEventSpy
  let deviceReadyEpic

  beforeEach(() => {
    jest.resetModules()

    fromEventSpy = jest.spyOn(require('rxjs'), 'fromEvent')

    openSpy = jest.fn()
    global.cordova = { InAppBrowser: { open: openSpy } }

    deviceReadyEpic = require('./deviceReady').deviceReadyEpic

    epicTest = epicTester(deviceReadyEpic)
  })

  it('dispatches an DEVICE_READY when document deviceready event is fired and substitutes window.open', () => {
    const inputValues = {}
    const expectedValues = {
      b: mobileActions.DEVICE_READY()
    }

    fromEventSpy.mockImplementation(() =>
      require('rxjs').of(new Event('deviceready'))
    )

    const inputMarble = '-'
    const expectedMarble = '(b|)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)

    expect(window.open).toBe(openSpy)
  })
})
