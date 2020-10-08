import { fetchDeviceTreeEpic } from './fetchDeviceTree'
import { removeDevicesEpic, retriggerDevicesListEpic } from './removeDevices'

export default [
  fetchDeviceTreeEpic,
  removeDevicesEpic,
  retriggerDevicesListEpic
]
