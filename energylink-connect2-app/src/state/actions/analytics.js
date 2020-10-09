import { createAction } from 'redux-act'

export const MIXPANEL_EVENT_QUEUED = createAction('MIXPANEL_EVENT_QUEUED')
export const MIXPANEL_EVENT_ERROR = createAction('MIXPANEL_EVENT_ERROR')

export const START_SCANNING = createAction('START_SCANNING')
export const CONNECT_PVS_MANUALLY = createAction('CONNECT_PVS_MANUALLY')
export const CONNECT_PVS_CAMERA = createAction('CONNECT_PVS_CAMERA')

export const CONFIG_START = createAction('START CONFIGURING THE PVS')
export const COMMISSIONING_START = createAction(
  'START COMMISSIONING OF THE PVS'
)
export const COMMISSIONING_FINISH = createAction('FINISH COMMISSIONING')
