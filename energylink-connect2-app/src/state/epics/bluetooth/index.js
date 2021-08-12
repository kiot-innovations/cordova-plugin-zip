import { connectPVSViaBluetoothEpic } from './connectPVSViaBluetoothEpic'
import {
  enableAccessPointViaBluetoothEpic,
  reConnectToPVSWiFiEpic
} from './enableAccessPointViaBluetoothEpic'
import { enableBluetoothEpic } from './enableBluetoothEpic'
import { getPairedPVSEpic } from './getPairedPVSEpic'
import { getPVSBluetoothDeviceEpic } from './getPVSBluetoothDeviceEpic'
import { getBLEDeviceListEpic } from './getPVSBluetoothDeviceListEpic'
import { statusBluetoothEpic } from './statusBluetoothEpic'

export default [
  getPVSBluetoothDeviceEpic,
  connectPVSViaBluetoothEpic,
  enableAccessPointViaBluetoothEpic,
  enableBluetoothEpic,
  statusBluetoothEpic,
  reConnectToPVSWiFiEpic,
  getBLEDeviceListEpic,
  getPairedPVSEpic
]
