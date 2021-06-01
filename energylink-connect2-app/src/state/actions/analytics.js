import { namedAction } from 'shared/redux-utils'

const analyticsAction = namedAction('Analytics')
const mixpanelActions = namedAction('Mixpanel')

export const BEGIN_INSTALL = analyticsAction('BEGIN_INSTALL')
export const COMMISSIONING_FINISH = analyticsAction('FINISH COMMISSIONING')
export const COMMISSION_SUCCESS = analyticsAction('COMMISSION_SUCCESS')
export const CONFIG_START = analyticsAction('Configure start')
export const CONNECT_PVS_CAMERA = analyticsAction('CONNECT_PVS_CAMERA')
export const CONNECT_PVS_MANUALLY = analyticsAction('CONNECT_PVS_MANUALLY')
export const FINISH_PLT_SETUP = analyticsAction('Finish PLT setup')
export const MIXPANEL_EVENT_ERROR = analyticsAction('MIXPANEL_EVENT_ERROR')
export const MIXPANEL_EVENT_QUEUED = mixpanelActions('Event queued')
export const RESET_PVS_INTERNET_TRACKING = analyticsAction(
  'RESET_PVS_INTERNET_TRACKING'
)
export const SCANNING_START = analyticsAction('Scanning start')
export const SET_AC_DEVICES = analyticsAction('Set AC modules')
export const CLAIM_DEVICES_MIXPANEL_EVENT = analyticsAction(
  'CLAIM DEVICES MIXPANEL EVENT'
)
export const START_BULK_SETTINGS_TIMER = analyticsAction('Start bulk settings')
export const START_PLT_SETUP = analyticsAction('Start PLT setup')
