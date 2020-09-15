import { createReducer } from 'redux-act'
import {
  FETCH_GRID_BEHAVIOR,
  FETCH_GRID_BEHAVIOR_ERR,
  FETCH_GRID_BEHAVIOR_SUCCESS,
  SET_GRID_PROFILE,
  SET_LAZY_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'

const initialState = {
  fetchingGridBehavior: false,
  profiles: [],
  err: '',
  exportLimit: [],
  gridVoltage: [],
  selectedOptions: {
    profile: '',
    exportLimit: '',
    gridVoltage: '',
    lazyGridProfile: 1
  }
}

export const gridBehaviorReducer = createReducer(
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
        gridVoltage: payload.gridVoltage.body.selected
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
      gridVoltage: {
        ...state.gridVoltage,
        selected: payload
      },
      selectedOptions: {
        ...state.selectedOptions,
        gridVoltage: payload
      }
    }),
    [SET_LAZY_GRID_PROFILE]: (state, payload) => ({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        lazyGridProfile: payload
      }
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState
  },
  initialState
)
