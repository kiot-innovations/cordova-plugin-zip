import * as pvsActions from '../../actions/pvs'

describe('Set Meta Data Epic', () => {
  const mockData = { some: 'data' }
  const setMetaData = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ status: 200, data: mockData }))
  const fetchMock = {
    getApiPVS: () => {
      return Promise.resolve({
        apis: {
          meta: {
            setMetaData
          }
        }
      })
    }
  }
  let epicTest
  let setMetaDataEpic

  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../../../shared/api', () => fetchMock)
    setMetaDataEpic = require('./setMetaDataEpic').setMetaDataEpic
    epicTest = epicTester(setMetaDataEpic)
    fetchMock.httpPost = () => mockData

    const inputValues = {
      a: pvsActions.SET_METADATA_INIT({ siteKey: 123 })
    }
    const expectedValues = {}

    const inputMarble = 'a'
    const expectedMarble = '-'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  it('dispatches an SET_METADATA_SUCCESS action after SET_METADATA_INIT call is successful', () =>
    expect(setMetaData).toHaveBeenCalledTimes(1))
})
