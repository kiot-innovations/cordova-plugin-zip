import { createReducer } from 'redux-act'
import {
  FETCH_GRID_BEHAVIOR,
  FETCH_GRID_BEHAVIOR_ERR,
  FETCH_GRID_BEHAVIOR_SUCCESS,
  SET_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE
} from '../../actions/systemConfiguration'

const initialState = {
  fetchingGridBehavior: false,
  profiles: [],
  err: '',
  exportLimit: [],
  gridVoltage: [],
  selectedOptions: {
    profile: '',
    exportLimit: '',
    gridVoltage: ''
  }
}

export const gridBehavior = createReducer(
  {
    [FETCH_GRID_BEHAVIOR]: state => ({
      ...state,
      fetchingGridBehavior: true
    }),
    [FETCH_GRID_BEHAVIOR_SUCCESS]: (state, payload) => ({
      ...state,
      profiles: payload.gridProfiles.profiles,
      exportLimit: payload.exportLimit,
      gridVoltage: payload.gridVoltage.body,
      fetchingGridBehavior: false,
      selectedOptions: {
        ...state.selectedOptions,
        exportLimit: payload.exportLimit.limit,
        gridVoltage: payload.gridVoltage.body.grid_voltage
      }
    }),
    [FETCH_GRID_BEHAVIOR_ERR]: (state, payload) => ({
      ...state,
      fetchingGridBehavior: false,
      err: payload
    }),
    [SET_GRID_PROFILE]: (state, payload) => ({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        profile: payload
      }
    }),
    [SET_EXPORT_LIMIT]: (state, payload) => ({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        exportLimit: payload
      }
    }),
    [SET_GRID_VOLTAGE]: (state, payload) => ({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        gridVoltage: payload
      }
    })
  },
  initialState
)
