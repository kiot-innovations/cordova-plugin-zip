import { fetchDeviceTreeEpic } from './fetchDeviceTree'
import {
  removeDevicesEpic,
  retriggerDevicesListEpic,
  triggerDeviceListPollingEpic,
  waitForDeviceListProcessingEpic
} from './removeDevicesEpic'
import { rmaRemoveStorageEpic } from './rmaStorageEpic'

export default [
  fetchDeviceTreeEpic,
  removeDevicesEpic,
  retriggerDevicesListEpic,
  rmaRemoveStorageEpic,
  triggerDeviceListPollingEpic,
  waitForDeviceListProcessingEpic,
  retriggerDevicesListEpic
]
