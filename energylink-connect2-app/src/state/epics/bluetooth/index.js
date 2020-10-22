import { connectPVSViaBluetoothEpic } from './connectPVSViaBluetoothEpic'
import { getPVSBluetoothDeviceEpic } from './getPVSBluetoothDeviceEpic'
import { enableAccessPointViaBluetoothEpic } from './enableAccessPointViaBluetoothEpic'
import { enableBluetoothEpic } from './enableBluetoothEpic'
import {
  statusBluetoothEpic,
  statusBluetoothRetryEpic
} from './statusBluetoothEpic'

export default [
  getPVSBluetoothDeviceEpic,
  connectPVSViaBluetoothEpic,
  enableAccessPointViaBluetoothEpic,
  enableBluetoothEpic,
  statusBluetoothEpic,
  statusBluetoothRetryEpic
]
