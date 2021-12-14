import * as mobileActions from 'state/actions/mobile'

describe('deviceResume Epic', () => {
  let epicTest
  let fromEventSpy
  let deviceResumeEpic

  beforeEach(() => {
    jest.resetModules()

    fromEventSpy = jest.spyOn(require('rxjs'), 'fromEvent')

    deviceResumeEpic = require('./deviceResume').deviceResumeEpic

    epicTest = epicTester(deviceResumeEpic)
  })

  it('dispatches an DEVICE_RESUME when document resume event is fired', () => {
    const inputValues = {}
    const expectedValues = {
      b: mobileActions.DEVICE_RESUME()
    }

    fromEventSpy.mockImplementation(() =>
      require('rxjs').of(new Event('resume'))
    )

    const inputMarble = '-'
    const expectedMarble = '(b|)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
