import { namedAction } from 'shared/redux-utils'

const analyticsAction = namedAction('Analytics')
const mixpanelActions = namedAction('Mixpanel')

export const MIXPANEL_EVENT_QUEUED = mixpanelActions('Event queued')
export const MIXPANEL_EVENT_ERROR = mixpanelActions('Event error')

export const CONNECT_PVS_MANUALLY = analyticsAction('Connect pvs manually')
export const CONNECT_PVS_CAMERA = analyticsAction('Connect pvs camera')

export const BEGIN_INSTALL = analyticsAction('Begin install')
export const COMMISSION_SUCCESS = analyticsAction('Commission success')
export const RESET_PVS_INTERNET_TRACKING = analyticsAction(
  'RESET_PVS_INTERNET_TRACKING'
)
export const SCANNING_START = analyticsAction('Scanning start')
export const CONFIG_START = analyticsAction('Configure start')
export const SET_AC_DEVICES = analyticsAction('Set AC modules')
export const START_PLT_SETUP = analyticsAction('Start PLT setup')
export const FINISH_PLT_SETUP = analyticsAction('Finish PLT setup')
export const START_BULK_SETTINGS_TIMER = analyticsAction('Start bulk settings')
