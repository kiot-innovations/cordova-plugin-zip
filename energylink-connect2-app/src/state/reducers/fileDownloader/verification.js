import { createReducer } from 'redux-act'
import {
  FILES_VERIFY,
  FILES_VERIFY_GP_COMPLETED,
  FILES_VERIFY_ESS_COMPLETED,
  FILES_VERIFY_PVS_COMPLETED
} from 'state/actions/fileDownloader'

const initialState = {
  gpVerified: null,
  pvsVerified: null,
  essVerified: null
}

export default createReducer(
  {
    [FILES_VERIFY]: () => initialState,
    [FILES_VERIFY_GP_COMPLETED]: (state, gpVerified) => ({
      ...state,
      gpVerified
    }),
    [FILES_VERIFY_ESS_COMPLETED]: (state, essVerified) => ({
      ...state,
      essVerified
    }),
    [FILES_VERIFY_PVS_COMPLETED]: (state, pvsVerified) => ({
      ...state,
      pvsVerified
    })
  },
  initialState
)
