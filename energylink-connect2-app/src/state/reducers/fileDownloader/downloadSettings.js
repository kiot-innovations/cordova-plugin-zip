import { createReducer } from 'redux-act'
import {
  DOWNLOAD_ALLOW_WITH_PVS,
  SET_ESS_UPDATE_OVERRIDE,
  SET_PVS_UPDATE_OVERRIDE,
  DEFAULT_ALL_UPDATE_OVERRIDES
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
  displaySuperuserSettings: false
}

export default createReducer(
  {
    [DOWNLOAD_ALLOW_WITH_PVS]: state => ({
      ...state,
      allowDownloadWithPVS: true
    }),
    [SET_ESS_UPDATE_OVERRIDE]: (state, essUpdateOverride) => ({
      ...state,
      essUpdateOverride,
      displaySuperuserSettings: true
    }),
    [SET_PVS_UPDATE_OVERRIDE]: (state, pvsUpdateOverride) => ({
      ...state,
      pvsUpdateOverride,
      displaySuperuserSettings: true
    }),
    [DEFAULT_ALL_UPDATE_OVERRIDES]: state => ({
      ...state,
      essUpdateOverride: {
        url: '',
        displayName: ''
      },
      pvsUpdateOverride: {
        url: '',
        displayName: ''
      },
      displaySuperuserSettings: false
    })
  },
  initialState
)
