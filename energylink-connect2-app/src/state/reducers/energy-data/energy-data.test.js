import * as authActions from '../../actions/auth'
import * as energyDataActions from '../../actions/energy-data'

import { energyDataReducer } from '.'

describe('Energy data reducer', () => {
  const reducerTest = reducerTester(energyDataReducer)
  const initialState = {
    [energyDataActions.INTERVALS.HOUR]: {
      startTime: 0,
      endTime: 0,
      data: {},
      powerData: {}
    },
    [energyDataActions.INTERVALS.DAY]: {
      startTime: 0,
      endTime: 0,
      data: {},
      powerData: {}
    },
    [energyDataActions.INTERVALS.MONTH]: {
      startTime: 0,
      endTime: 0,
      data: {},
      powerData: {}
    },
    [energyDataActions.INTERVALS.YEAR]: {
      startTime: 0,
      endTime: 0,
      data: {},
      powerData: {}
    },
    lte: {
      energyProduction: [],
      energyConsumption: [],
      unit: 'kilowatt_hour'
    },
    currentPower: {
      production: 0,
      consumption: 0,
      storage: 0
    },
    isGettingLTEData: false,
    isGettingCurrentPower: false,
    isLoading: {
      [energyDataActions.INTERVALS.HOUR]: false,
      [energyDataActions.INTERVALS.DAY]: false,
      [energyDataActions.INTERVALS.MONTH]: false,
      [energyDataActions.INTERVALS.YEAR]: false
    },
    isLoadingPower: {
      [energyDataActions.INTERVALS.HOUR]: false,
      [energyDataActions.INTERVALS.DAY]: false,
      [energyDataActions.INTERVALS.MONTH]: false,
      [energyDataActions.INTERVALS.YEAR]: false
    },
    isPolling: {
      [energyDataActions.INTERVALS.HOUR]: false,
      [energyDataActions.INTERVALS.DAY]: false,
      [energyDataActions.INTERVALS.MONTH]: false,
      [energyDataActions.INTERVALS.YEAR]: false
    },
    isPollingPower: {
      [energyDataActions.INTERVALS.HOUR]: false,
      [energyDataActions.INTERVALS.DAY]: false,
      [energyDataActions.INTERVALS.MONTH]: false,
      [energyDataActions.INTERVALS.YEAR]: false
    },
    isPollingCurrentPower: false,
    isPollingLTD: false
  }
  const energyData = {
    '2019-09-18T14:15:00Z': {
      p: 241.2,
      c: 0,
      s: 1
    },
    '2019-09-18T14:30:00Z': {
      p: 243.6,
      c: 0,
      s: 1
    },
    '2019-09-18T14:45:00Z': {
      p: 255.6,
      c: 0,
      s: 1
    }
  }
  const powerData = {
    '2019-09-18T14:15:00Z': {
      pp: 1310.32,
      pc: 964.8,
      ps: 327.58
    },
    '2019-09-18T14:30:00Z': {
      pp: 1410.78,
      pc: 974.4,
      ps: 352.7
    },
    '2019-09-18T14:45:00Z': {
      pp: 1511.24,
      pc: 1022.4,
      ps: 377.81
    }
  }
  const lteData = {
    unit: 'kilowatt_hour',
    energyProduction: [
      ['2015-01-01T00:00:00', 761.5244, 89],
      ['2016-01-01T00:00:00', 3948.3778, 60],
      ['2017-01-01T00:00:00', 4020.6485, 51],
      ['2018-01-01T00:00:00', 4143.6685, 51],
      ['2019-01-01T00:00:00', 3384.013, 80]
    ],
    energyConsumption: [
      ['2015-01-01T00:00:00', 1234.4944, 0],
      ['2016-01-01T00:00:00', 4293.7378, 0],
      ['2017-01-01T00:00:00', 5405.0485, 0],
      ['2018-01-01T00:00:00', 5696.1285, 0],
      ['2019-01-01T00:00:00', 1721.073, 0]
    ]
  }

  it('returns the initial state', () => {
    reducerTest(undefined, {}, initialState)
  })

  it('normalizes and merges energy data when fetched', () => {
    reducerTest(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: true
        }
      },
      energyDataActions.NORMALIZE_ENERGY_DATA_SUCCESS({
        startTime: 1566212417813,
        endTime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:15:00Z': {
            p: 21.2,
            c: 0,
            s: 1
          },
          '2019-09-18T18:15:00Z': {
            p: 9,
            c: 9,
            s: 9
          }
        }
      }),
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: {
            '2019-09-18T14:15:00Z': {
              p: 21.2,
              c: 0,
              s: 1
            },
            '2019-09-18T14:30:00Z': {
              p: 243.6,
              c: 0,
              s: 1
            },
            '2019-09-18T14:45:00Z': {
              p: 255.6,
              c: 0,
              s: 1
            },
            '2019-09-18T18:15:00Z': {
              p: 9,
              c: 9,
              s: 9
            }
          },
          endTime: 1566298817813,
          startTime: 1566212417813
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: false
        }
      }
    )
  })

  it('keeps data keys in order', () => {
    const newState = energyDataReducer(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        }
      },
      energyDataActions.NORMALIZE_ENERGY_DATA_SUCCESS({
        startTime: 1566212417813,
        endTime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:20:00Z': {
            p: 21.2,
            c: 0,
            s: 1
          }
        }
      })
    )

    expect(
      Object.keys(newState[energyDataActions.INTERVALS.HOUR].data)
    ).toEqual([
      '2019-09-18T14:15:00Z',
      '2019-09-18T14:20:00Z',
      '2019-09-18T14:30:00Z',
      '2019-09-18T14:45:00Z'
    ])
  })

  it('sets the loading flag based on interval', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        },
        [energyDataActions.INTERVALS.DAY]: {
          data: energyData
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: false,
          [energyDataActions.INTERVALS.DAY]: false
        }
      },
      energyDataActions.GET_ENERGY_DATA_INIT({
        interval: energyDataActions.INTERVALS.HOUR
      }),
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        },
        [energyDataActions.INTERVALS.DAY]: {
          data: energyData
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: true,
          [energyDataActions.INTERVALS.DAY]: false
        }
      }
    )
  })

  it('resets the loading flag if an error occurrs', () => {
    reducerTest(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: true
        }
      },
      energyDataActions.GET_ENERGY_DATA_ERROR({
        interval: energyDataActions.INTERVALS.HOUR,
        error: new Error('something happened')
      }),
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        },
        isLoading: {
          [energyDataActions.INTERVALS.HOUR]: false
        }
      }
    )
  })

  it('should maintain energy data if addressId is the same on login', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        }
      },
      authActions.LOGIN_SUCCESS({ addressId: 12345 }),
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        }
      }
    )
  })

  it('should wipe out energy data if addressId is the same on login', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          data: energyData
        }
      },
      authActions.LOGIN_SUCCESS({ addressId: 5555 }),
      {
        ...initialState,
        siteId: 5555
      }
    )
  })
  // ---
  it('normalizes and merges power data when fetched', () => {
    reducerTest(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: true
        }
      },
      energyDataActions.NORMALIZE_POWER_DATA_SUCCESS({
        startTime: 1566212417813,
        endTime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:15:00Z': {
            pp: 0.32,
            pc: 94.8,
            ps: 37.58
          },
          '2019-09-18T18:15:00Z': {
            pp: 9,
            pc: 9,
            ps: 9
          }
        }
      }),
      {
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: {
            '2019-09-18T14:15:00Z': {
              pp: 0.32,
              pc: 94.8,
              ps: 37.58
            },
            '2019-09-18T14:30:00Z': {
              pp: 1410.78,
              pc: 974.4,
              ps: 352.7
            },
            '2019-09-18T14:45:00Z': {
              pp: 1511.24,
              pc: 1022.4,
              ps: 377.81
            },
            '2019-09-18T18:15:00Z': {
              pp: 9,
              pc: 9,
              ps: 9
            }
          },
          endTime: 1566298817813,
          startTime: 1566212417813
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: false
        }
      }
    )
  })

  it('keeps power data keys in order', () => {
    const newState = energyDataReducer(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        }
      },
      energyDataActions.NORMALIZE_POWER_DATA_SUCCESS({
        startTime: 1566212417813,
        endTime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:20:00Z': {
            pp: 0.32,
            pc: 94.8,
            ps: 37.58
          }
        }
      })
    )

    expect(
      Object.keys(newState[energyDataActions.INTERVALS.HOUR].powerData)
    ).toEqual([
      '2019-09-18T14:15:00Z',
      '2019-09-18T14:20:00Z',
      '2019-09-18T14:30:00Z',
      '2019-09-18T14:45:00Z'
    ])
  })

  it('sets the loading power flag based on interval', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        },
        [energyDataActions.INTERVALS.DAY]: {
          powerData: powerData
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: false,
          [energyDataActions.INTERVALS.DAY]: false
        }
      },
      energyDataActions.GET_POWER_DATA_INIT({
        interval: energyDataActions.INTERVALS.HOUR
      }),
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        },
        [energyDataActions.INTERVALS.DAY]: {
          powerData: powerData
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: true,
          [energyDataActions.INTERVALS.DAY]: false
        }
      }
    )
  })

  it('resets the loading power flag if an error occurrs', () => {
    reducerTest(
      {
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: true
        }
      },
      energyDataActions.GET_POWER_DATA_ERROR({
        interval: energyDataActions.INTERVALS.HOUR,
        error: new Error('something happened')
      }),
      {
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        },
        isLoadingPower: {
          [energyDataActions.INTERVALS.HOUR]: false
        }
      }
    )
  })

  it('should maintain power data if addressId is the same on login', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        }
      },
      authActions.LOGIN_SUCCESS({ addressId: 12345 }),
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        }
      }
    )
  })

  it('should wipe out power data if addressId is the same on login', () => {
    reducerTest(
      {
        ...initialState,
        siteId: 12345,
        [energyDataActions.INTERVALS.HOUR]: {
          powerData: powerData
        }
      },
      authActions.LOGIN_SUCCESS({ addressId: 5555 }),
      {
        ...initialState,
        siteId: 5555
      }
    )
  })

  it('set true the isGettingLTEData flag when FETCH_LTE_DATA_INIT action is fired', () => {
    reducerTest(initialState, energyDataActions.FETCH_LTE_DATA_INIT(), {
      ...initialState,
      isGettingLTEData: true,
      isPollingLTD: true
    })
  })

  it('set false the isGettingLTEData flag & set LTE value when FETCH_LTE_DATA_SUCCESS action is fired', () => {
    reducerTest(
      {
        ...initialState,
        isGettingLTEData: true
      },
      energyDataActions.FETCH_LTE_DATA_SUCCESS(lteData),
      {
        ...initialState,
        isGettingLTEData: false,
        lte: lteData
      }
    )
  })

  it('return to initial state when FETCH_LTE_DATA_ERROR action is fired', () => {
    reducerTest(
      { ...initialState, lte: lteData },
      energyDataActions.FETCH_LTE_DATA_ERROR(),
      initialState
    )
  })

  it('set true the isGettingCurrentPower & isPollingCurrentPower flags when FETCH_CURRENT_POWER_INIT action is fired', () => {
    reducerTest(initialState, energyDataActions.FETCH_CURRENT_POWER_INIT(), {
      ...initialState,
      isGettingCurrentPower: true,
      isPollingCurrentPower: true
    })
  })

  it('set false the isGettingCurrentPower flag & set currentPower value when FETCH_CURRENT_POWER_SUCCESS action is fired', () => {
    reducerTest(
      {
        ...initialState,
        isGettingCurrentPower: true
      },
      energyDataActions.FETCH_CURRENT_POWER_SUCCESS({
        production: 3.4566,
        consumption: 1.0315,
        storage: 0.0953
      }),
      {
        ...initialState,
        isGettingCurrentPower: false,
        currentPower: {
          production: 3.4566,
          consumption: 1.0315,
          storage: 0.0953
        }
      }
    )
  })

  it('return to initial state when FETCH_CURRENT_POWER_ERROR action is fired', () => {
    reducerTest(
      {
        ...initialState,
        currentPower: {
          production: 3.4566,
          consumption: 1.0315,
          storage: 0.0953
        }
      },
      energyDataActions.FETCH_CURRENT_POWER_ERROR(),
      initialState
    )
  })

  it('sets isPolling based on the interval given on ENERGY_DATA_POLLING action', () => {
    reducerTest(
      initialState,
      energyDataActions.ENERGY_DATA_POLLING({
        interval: energyDataActions.INTERVALS.HOUR
      }),
      {
        ...initialState,
        isPolling: {
          ...initialState.isPolling,
          [energyDataActions.INTERVALS.HOUR]: true
        }
      }
    )
  })

  it('resets all polling flags when ENERGY_DATA_STOP_POLLING is fired', () => {
    reducerTest(
      {
        ...initialState,
        isPolling: {
          ...initialState.isPolling,
          [energyDataActions.INTERVALS.HOUR]: true,
          [energyDataActions.INTERVALS.DAY]: true
        }
      },
      energyDataActions.ENERGY_DATA_STOP_POLLING(),
      initialState
    )
  })

  it('resets isPollingCurrentPower flag when CURRENT_POWER_DATA_STOP_POLLING is fired', () => {
    reducerTest(
      {
        ...initialState,
        isPollingCurrentPower: true
      },
      energyDataActions.CURRENT_POWER_DATA_STOP_POLLING(),
      initialState
    )
  })

  it('resets all polling flags when LTE_DATA_POLL_STOP is fired', () => {
    reducerTest(
      {
        ...initialState,
        isPollingLTD: true
      },
      energyDataActions.LTE_DATA_POLL_STOP(),
      initialState
    )
  })
})
