import { createReducer } from 'redux-act'
import { path } from 'ramda'
import {
  FETCH_GRID_BEHAVIOR,
  FETCH_GRID_BEHAVIOR_ERR,
  FETCH_GRID_BEHAVIOR_SUCCESS,
  SET_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

export const GRID_ERRORS = {
  NO_PROFILE_AVAILABLE: 'NO_PROFILE_AVAILABLE'
}

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

export const gridBehaviorReducer = createReducer(
  {
    [FETCH_GRID_BEHAVIOR]: state => ({
      ...state,
      fetchingGridBehavior: true
    }),
    [FETCH_GRID_BEHAVIOR_SUCCESS]: (state, payload) => {
      const hasGridVoltageSelected = path(
        ['selectedOptions', 'gridVoltage'],
        state
      )
      return {
        ...state,
        profiles: payload.gridProfiles.profiles,
        exportLimit: payload.exportLimit,
        gridVoltage: hasGridVoltageSelected
          ? {
              ...payload.gridVoltage.body,
              selected: hasGridVoltageSelected
            }
          : payload.gridVoltage.body,
        fetchingGridBehavior: false,
        selectedOptions: {
          ...state.selectedOptions,
          exportLimit: payload.exportLimit.limit,
          gridVoltage: hasGridVoltageSelected
            ? hasGridVoltageSelected
            : payload.gridVoltage.body.selected
        }
      }
    },
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
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
