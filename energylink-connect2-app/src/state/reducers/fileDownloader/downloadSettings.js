import { createReducer } from 'redux-act'
import {
  DOWNLOAD_ALLOW_WITH_PVS,
  SET_ESS_UPDATE_OVERRIDE,
  SET_PVS_UPDATE_OVERRIDE,
  DEFAULT_ALL_UPDATE_OVERRIDES,
  SET_DO_NOT_UPDATE_PVS,
  SET_DO_NOT_UPDATE_ESS
} from 'state/actions/fileDownloader'

const initialState = {
  allowDownloadWithPVS: false,
  essUpdateOverride: {
    url: '',
    displayName: ''
  },
  pvsUpdateOverride: {
    url: '',
    displayName: ''
  },
  doNotUpdatePVS: false,
  doNotUpdateESS: false
}

export default createReducer(
  {
    [DOWNLOAD_ALLOW_WITH_PVS]: state => ({
      ...state,
      allowDownloadWithPVS: true
    }),
    [SET_ESS_UPDATE_OVERRIDE]: (state, essUpdateOverride) => ({
      ...state,
      essUpdateOverride
    }),
    [SET_PVS_UPDATE_OVERRIDE]: (state, pvsUpdateOverride) => ({
      ...state,
      pvsUpdateOverride
    }),
    [SET_DO_NOT_UPDATE_PVS]: (state, doNotUpdatePVS) => ({
      ...state,
      doNotUpdatePVS
    }),
    [SET_DO_NOT_UPDATE_ESS]: (state, doNotUpdateESS) => ({
      ...state,
      doNotUpdateESS
    }),
    [DEFAULT_ALL_UPDATE_OVERRIDES]: state => ({
      ...state,
      doNotUpdatePVS: false,
      doNotUpdateESS: false,
      essUpdateOverride: {
        url: '',
        displayName: ''
      },
      pvsUpdateOverride: {
        url: '',
        displayName: ''
      }
    })
  },
  initialState
)
