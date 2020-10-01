import { createReducer } from 'redux-act'
import { DOWNLOAD_ALLOW_WITH_PVS } from 'state/actions/fileDownloader'

const initialState = {
  allowDownloadWithPVS: false
}

export default createReducer(
  {
    [DOWNLOAD_ALLOW_WITH_PVS]: state => ({
      ...state,
      allowDownloadWithPVS: true
    })
  },
  initialState
)
