import * as authActions from '../../actions/auth'
import { throwError } from 'rxjs'

describe('Login Epic', () => {
  const mockData = { some: 'data' }
  const fetchMock = {}
  let epicTest
  let performLoginEpic

  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../../../shared/fetch', () => fetchMock)
    performLoginEpic = require('./loginEpic').loginEpic
    epicTest = epicTester(performLoginEpic)
  })

  it('dispatches an LOGIN_SUCCESS action if the login call is successful', () => {
    fetchMock.httpPost = () => [{ status: 200, data: mockData }]

    const inputValues = {
      a: authActions.LOGIN_INIT()
    }
    const expectedValues = {
      b: authActions.LOGIN_SUCCESS(mockData)
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  it('dispatches an LOGIN_ERROR action if the login call is unsuccessful', () => {
    fetchMock.httpPost = () => [{ status: 400, data: mockData }]

    const inputValues = {
      a: authActions.LOGIN_INIT()
    }
    const expectedValues = {
      b: authActions.LOGIN_ERROR({ status: 400, data: mockData })
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  it('dispatches an LOGIN_ERROR action if the login call throws exception', () => {
    const error = new Error('something happened!')
    fetchMock.httpPost = () => throwError(error)

    const inputValues = {
      a: authActions.LOGIN_INIT()
    }
    const expectedValues = {
      b: authActions.LOGIN_ERROR(error)
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
