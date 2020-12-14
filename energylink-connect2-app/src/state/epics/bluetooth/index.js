import { connectPVSViaBluetoothEpic } from './connectPVSViaBluetoothEpic'
import { getPVSBluetoothDeviceEpic } from './getPVSBluetoothDeviceEpic'
import {
  enableAccessPointViaBluetoothEpic,
  reConnectToPVSWiFiEpic
} from './enableAccessPointViaBluetoothEpic'
import { enableBluetoothEpic } from './enableBluetoothEpic'
import { statusBluetoothEpic } from './statusBluetoothEpic'
import { getBLEDeviceListEpic } from './getPVSBluetoothDeviceListEpic'

export default [
  getPVSBluetoothDeviceEpic,
  connectPVSViaBluetoothEpic,
  enableAccessPointViaBluetoothEpic,
  enableBluetoothEpic,
  statusBluetoothEpic,
  reConnectToPVSWiFiEpic,
  getBLEDeviceListEpic
]
