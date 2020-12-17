import { createAction } from 'redux-act'
import { namedAction } from 'shared/redux-utils'

const analyticsAction = namedAction('Analytics')

export const MIXPANEL_EVENT_QUEUED = createAction('MIXPANEL_EVENT_QUEUED')
export const MIXPANEL_EVENT_ERROR = createAction('MIXPANEL_EVENT_ERROR')

export const CONNECT_PVS_MANUALLY = createAction('CONNECT_PVS_MANUALLY')
export const CONNECT_PVS_CAMERA = createAction('CONNECT_PVS_CAMERA')

export const BEGIN_INSTALL = createAction('BEGIN_INSTALL')
export const COMMISSION_SUCCESS = createAction('COMMISSION_SUCCESS')
export const SCANNING_START = analyticsAction('Scanning start')
export const CONFIG_START = analyticsAction('Configure start')
