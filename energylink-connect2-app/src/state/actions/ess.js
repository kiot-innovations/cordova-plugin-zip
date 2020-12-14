import { createAction } from 'redux-act'

export const DOWNLOAD_OS_INIT = createAction('DOWNLOAD_OS_INIT')
export const DOWNLOAD_OS_SUCCESS = createAction('DOWNLOAD_OS_SUCCESS')
export const DOWNLOAD_OS_PROGRESS = createAction('DOWNLOAD_OS_PROGRESS')
export const DOWNLOAD_OS_ERROR = createAction('DOWNLOAD_OS_ERROR')
export const DOWNLOAD_OS_UPDATE_VERSION = createAction(
  'DOWNLOAD_OS_UPDATE_VERSION'
)
export const DOWNLOAD_OS_REPORT_SUCCESS = createAction(
  'DOWNLOAD_OS_REPORT_SUCCESS'
)
