import { createAction } from 'redux-act'

export const MIXPANEL_EVENT_QUEUED = createAction('MIXPANEL_EVENT_QUEUED')
export const MIXPANEL_EVENT_ERROR = createAction('MIXPANEL_EVENT_ERROR')
export const CONFIG_START = createAction('START CONFIGURING THE PVS')
export const COMMISSIONING_START = createAction(
  'START COMMISSIONING OF THE PVS'
)
export const COMMISSIONING_FINISH = createAction('FINISH COMMISSIONING')
