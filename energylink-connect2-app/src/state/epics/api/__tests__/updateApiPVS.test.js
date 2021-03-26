import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import * as apis from 'shared/api'

import { upgradeApiPvsEpic } from '../updateApiPVS'
import { of } from 'rxjs'

describe('The upgrade api PVS epic', () => {
  it('should force the upgrade on PVS_CONNECTION_SUCCESS', () => {
    const epicTest = epicTester(upgradeApiPvsEpic)

    const inputValues = { a: PVS_CONNECTION_SUCCESS() }
    const inputMarbles = 'a'

    const expectedValues = {}
    const expectedMarbles = ''
    const getApiPvsMock = jest.fn(() => of({ swaggerInfo: '' }))

    apis.getApiPVS = getApiPvsMock

    epicTest(inputMarbles, expectedMarbles, inputValues, expectedValues)
    expect(getApiPvsMock).toBeCalledTimes(1)
  })
})
