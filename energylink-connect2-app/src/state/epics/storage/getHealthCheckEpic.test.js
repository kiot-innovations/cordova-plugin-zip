import { of } from 'rxjs'

import { getHealthCheckEpic } from './getHealthCheckEpic'

import * as api from 'shared/api'
import {
  GET_ESS_STATUS_COMPLETE,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_UPDATE,
  RUN_EQS_SYSTEMCHECK_SUCCESS
} from 'state/actions/storage'

const mockResponses = {
  notRunning: {
    status: 200,
    body: {
      equinox_system_check_status: 'NOT_RUNNING'
    }
  },
  succeeded: {
    status: 200,
    body: {
      equinox_system_check_status: 'SUCCEEDED'
    }
  },
  running: {
    status: 200,
    body: {
      equinox_system_check_status: 'RUNNING'
    }
  },
  failed: {
    status: 200,
    body: {
      equinox_system_check_status: 'FAILED',
      errors: [
        {
          error_code: '14006'
        }
      ]
    }
  },
  failedWithoutErrors: {
    status: 200,
    body: {
      equinox_system_check_status: 'FAILED'
    }
  }
}

describe('Storage System Check Polling', () => {
  let mockSystemHealthReport

  beforeEach(() => {
    jest.resetModules()
  })

  it('dispatches GET_ESS_STATUS_COMPLETE if status is FAILED and response contains errors', done => {
    mockSystemHealthReport = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponses.failed))

    jest.spyOn(api, 'getApiPVS').mockResolvedValue({
      apis: {
        commissioning: {
          getSystemHealthReport: mockSystemHealthReport
        }
      }
    })

    getHealthCheckEpic(of(RUN_EQS_SYSTEMCHECK_SUCCESS())).subscribe(action => {
      expect(action).toStrictEqual(
        GET_ESS_STATUS_COMPLETE({
          ess_report: {},
          errors: [
            {
              error_code: '14006'
            }
          ]
        })
      )
      expect(mockSystemHealthReport).toBeCalledTimes(1)
      done()
    })
  })
  it('dispatches GET_ESS_STATUS_ERROR if status is FAILED and response does not contain errors', done => {
    mockSystemHealthReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockResponses.failedWithoutErrors)
      )

    jest.spyOn(api, 'getApiPVS').mockResolvedValue({
      apis: {
        commissioning: {
          getSystemHealthReport: mockSystemHealthReport
        }
      }
    })

    getHealthCheckEpic(of(RUN_EQS_SYSTEMCHECK_SUCCESS())).subscribe(action => {
      expect(action).toStrictEqual(
        GET_ESS_STATUS_ERROR({
          response: {
            body: { result: 'ESS_STATUS_ERROR' }
          }
        })
      )
      expect(mockSystemHealthReport).toBeCalledTimes(1)
      done()
    })
  })
  it('dispatches GET_ESS_STATUS_ERROR if status is NOT_RUNNING', done => {
    mockSystemHealthReport = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponses.notRunning))

    jest.spyOn(api, 'getApiPVS').mockResolvedValue({
      apis: {
        commissioning: {
          getSystemHealthReport: mockSystemHealthReport
        }
      }
    })

    getHealthCheckEpic(of(RUN_EQS_SYSTEMCHECK_SUCCESS())).subscribe(action => {
      expect(action).toStrictEqual(
        GET_ESS_STATUS_ERROR({
          response: {
            body: { result: 'ESS_STATUS_ERROR' }
          }
        })
      )
      expect(mockSystemHealthReport).toBeCalledTimes(1)
      done()
    })
  })
  it('dispatches GET_ESS_STATUS_UPDATE if status is RUNNING', done => {
    mockSystemHealthReport = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponses.running))

    jest.spyOn(api, 'getApiPVS').mockResolvedValue({
      apis: {
        commissioning: {
          getSystemHealthReport: mockSystemHealthReport
        }
      }
    })

    getHealthCheckEpic(of(RUN_EQS_SYSTEMCHECK_SUCCESS())).subscribe(action => {
      expect(action).toStrictEqual(GET_ESS_STATUS_UPDATE())
      expect(mockSystemHealthReport).toBeCalledTimes(1)
      done()
    })
  })
  it('dispatches GET_ESS_STATUS_SUCCESS if status is SUCCEEDED', done => {
    mockSystemHealthReport = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponses.succeeded))

    jest.spyOn(api, 'getApiPVS').mockResolvedValue({
      apis: {
        commissioning: {
          getSystemHealthReport: mockSystemHealthReport
        }
      }
    })

    getHealthCheckEpic(of(RUN_EQS_SYSTEMCHECK_SUCCESS())).subscribe(action => {
      expect(action).toStrictEqual(GET_ESS_STATUS_SUCCESS())
      expect(mockSystemHealthReport).toBeCalledTimes(1)
      done()
    })
  })
})
