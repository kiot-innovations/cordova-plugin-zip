import { createReducer } from 'redux-act'

import {
  DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS,
  SHOW_SUPERUSER_SETTINGS,
  HIDE_SUPERUSER_SETTINGS
} from 'state/actions/superuser'

const initialState = {
  essUpdateList: [],
  pvsUpdateList: [],
  showSuperuserSettings: false
}

const getPVSDisplayName = pvsURL => {
  const urlSplit = pvsURL.split('/')
  const releaseName = urlSplit[3]
  const releaseNumber = urlSplit[4]
  return `${releaseName} (${releaseNumber})`
}

export const superuserReducer = createReducer(
  {
    [DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS]: (state, payload) => {
      const pvsUpdateList = payload.map(item => ({
        displayName: getPVSDisplayName(item.pvs),
        url: item.pvs
      }))
      return {
        ...state,
        essUpdateList: payload,
        pvsUpdateList: pvsUpdateList
      }
    },
    [SHOW_SUPERUSER_SETTINGS]: state => {
      return {
        ...state,
        showSuperuserSettings: true
      }
    },
    [HIDE_SUPERUSER_SETTINGS]: state => {
      return {
        ...state,
        showSuperuserSettings: false
      }
    }
  },
  initialState
)
