import { fetchDeviceTreeEpic } from './fetchDeviceTree'
import {
  removeDevicesEpic,
  retriggerDevicesListEpic
} from './removeDevicesEpic'

export default [
  fetchDeviceTreeEpic,
  removeDevicesEpic,
  retriggerDevicesListEpic
]
