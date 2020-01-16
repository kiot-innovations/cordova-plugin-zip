import * as siteActions from '../../actions/site'
import { throwError } from 'rxjs'
import { sitesMock } from './sitesMock'

describe('Fetch Sites Epic', () => {
  const mockData = sitesMock
  const fetchMock = {}
  let epicTest
  let fetchSitesEpic

  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../../../shared/fetch', () => fetchMock)
    fetchSitesEpic = require('./fetchSitesEpic').fetchSitesEpic
    epicTest = epicTester(fetchSitesEpic)
  })

  it('dispatches an GET_SITES_SUCCESS action if the GET call is successful', () => {
    fetchMock.httpGet = () => [{ status: 200, data: mockData }]

    const inputValues = {
      a: siteActions.GET_SITES_INIT()
    }
    const expectedValues = {
      b: siteActions.GET_SITES_SUCCESS(mockData)
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  // TODO: Uncomment this when removing Mocking
  /* it('dispatches a GET_SITES_ERROR action if the call is unsuccessful', () => {
    fetchMock.httpGet = () => [{ status: 400, data: mockData }]

    const inputValues = {
      a: siteActions.GET_SITES_INIT()
    }
    const expectedValues = {
      b: siteActions.GET_SITES_ERROR({ status: 400, data: mockData })
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  }) */

  it('dispatches an LOGIN_ERROR action if the login call throws exception', () => {
    const error = new Error('something happened!')
    fetchMock.httpGet = () => throwError(error)

    const inputValues = {
      a: siteActions.GET_SITES_INIT()
    }
    const expectedValues = {
      b: siteActions.GET_SITES_ERROR(error)
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
