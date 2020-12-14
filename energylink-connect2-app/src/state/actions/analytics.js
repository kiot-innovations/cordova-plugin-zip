import { createAction } from 'redux-act'

export const MIXPANEL_EVENT_QUEUED = createAction('MIXPANEL_EVENT_QUEUED')
export const MIXPANEL_EVENT_ERROR = createAction('MIXPANEL_EVENT_ERROR')

export const CONNECT_PVS_MANUALLY = createAction('CONNECT_PVS_MANUALLY')
export const CONNECT_PVS_CAMERA = createAction('CONNECT_PVS_CAMERA')

export const COMMISSIONING_FINISH = createAction('FINISH COMMISSIONING')

export const BEGIN_INSTALL = createAction('BEGIN_INSTALL')
export const COMMISSION_SUCCESS = createAction('COMMISSION_SUCCESS')
