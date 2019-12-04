import {
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  GET_FILE
} from 'state/actions/fileDownloader'

const initialState = {
  progress: 0,
  lastProgress: 0
}

export default function(state = initialState, action) {
  const { payload, type } = action
  if (type === [DOWNLOAD_PROGRESS])
    return { progress: payload.progress, lastProgress: state.progress }
  if (type === [DOWNLOAD_SUCCESS]) return { progress: 100, lastProgress: 0 }
  if (type === [GET_FILE]) return { progress: 100, lastProgress: 0 }
  return state
}
