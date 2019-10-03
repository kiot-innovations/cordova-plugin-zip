import * as energyDataActions from '../../actions/energy-data'
import * as authActions from '../../actions/auth'

import { energyDataReducer } from '.'

describe('Energy data reducer', () => {
  const reducerTest = reducerTester(energyDataReducer)
  const initialState = {
    [energyDataActions.INTERVALS.HOUR]: {
      starttime: 0,
      endtime: 0,
      data: {}
    },
    [energyDataActions.INTERVALS.DAY]: {
      starttime: 0,
      endtime: 0,
      data: {}
    },
    [energyDataActions.INTERVALS.MONTH]: {
      starttime: 0,
      endtime: 0,
      data: {}
    },
    isLoading: {
      [energyDataActions.INTERVALS.HOUR]: false,
      [energyDataActions.INTERVALS.DAY]: false,
      [energyDataActions.INTERVALS.MONTH]: false
    }
  }
  const energyData = {
    '2019-09-18T14:15:00Z': {
      pp: 1310.32,
      pc: 964.8,
      ps: 327.58,
      p: 241.2,
      c: 0,
      s: 1,
      soc: 0,
      weather: 'clearsky'
    },
    '2019-09-18T14:30:00Z': {
      pp: 1410.78,
      pc: 974.4,
      ps: 352.7,
      p: 243.6,
      c: 0,
      s: 1,
      soc: 0,
      weather: 'clearsky'
    },
    '2019-09-18T14:45:00Z': {
      pp: 1511.24,
      pc: 1022.4,
      ps: 377.81,
      p: 255.6,
      c: 0,
      s: 1,
      soc: 0,
      weather: 'clearsky'
    }
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
        starttime: 1566212417813,
        endtime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:15:00Z': {
            pp: 0.32,
            pc: 94.8,
            ps: 37.58,
            p: 21.2,
            c: 0,
            s: 1,
            soc: 0,
            weather: 'cloudy'
          },
          '2019-09-18T18:15:00Z': {
            pp: 9,
            pc: 9,
            ps: 9,
            p: 9,
            c: 9,
            s: 9,
            soc: 0,
            weather: 'clearsky'
          }
        }
      }),
      {
        [energyDataActions.INTERVALS.HOUR]: {
          data: {
            '2019-09-18T14:15:00Z': {
              pp: 0.32,
              pc: 94.8,
              ps: 37.58,
              p: 21.2,
              c: 0,
              s: 1,
              soc: 0,
              weather: 'cloudy'
            },
            '2019-09-18T14:30:00Z': {
              pp: 1410.78,
              pc: 974.4,
              ps: 352.7,
              p: 243.6,
              c: 0,
              s: 1,
              soc: 0,
              weather: 'clearsky'
            },
            '2019-09-18T14:45:00Z': {
              pp: 1511.24,
              pc: 1022.4,
              ps: 377.81,
              p: 255.6,
              c: 0,
              s: 1,
              soc: 0,
              weather: 'clearsky'
            },
            '2019-09-18T18:15:00Z': {
              pp: 9,
              pc: 9,
              ps: 9,
              p: 9,
              c: 9,
              s: 9,
              soc: 0,
              weather: 'clearsky'
            }
          },
          endtime: 1566298817813,
          starttime: 1566212417813
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
        starttime: 1566212417813,
        endtime: 1566298817813,
        interval: energyDataActions.INTERVALS.HOUR,
        normalizedData: {
          '2019-09-18T14:20:00Z': {
            pp: 0.32,
            pc: 94.8,
            ps: 37.58,
            p: 21.2,
            c: 0,
            s: 1,
            soc: 0,
            weather: 'cloudy'
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
})
