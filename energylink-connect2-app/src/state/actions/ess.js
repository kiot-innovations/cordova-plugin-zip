import { createAction } from 'redux-act'

export const DOWNLOAD_META_INIT = createAction('DOWNLOAD_META_INIT')
export const DOWNLOAD_META_SUCCESS = createAction('DOWNLOAD_META_SUCCESS')
export const DOWNLOAD_META_ERROR = createAction('DOWNLOAD_META_ERROR')

export const DOWNLOAD_OS_INIT = createAction('DOWNLOAD_OS_INIT')
export const DOWNLOAD_OS_SUCCESS = createAction('DOWNLOAD_OS_SUCCESS')
export const DOWNLOAD_OS_PROGRESS = createAction('DOWNLOAD_OS_PROGRESS')
export const DOWNLOAD_OS_ERROR = createAction('DOWNLOAD_OS_ERROR')
