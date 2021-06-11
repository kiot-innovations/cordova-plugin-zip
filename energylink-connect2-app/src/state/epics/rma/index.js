import { fetchDeviceTreeEpic } from './fetchDeviceTree'
import {
  removeDevicesEpic,
  retriggerDevicesListEpic,
  triggerDeviceListPollingEpic,
  waitForDeviceListProcessingEpic
} from './removeDevicesEpic'

export default [
  fetchDeviceTreeEpic,
  removeDevicesEpic,
  triggerDeviceListPollingEpic,
  waitForDeviceListProcessingEpic,
  retriggerDevicesListEpic
]
