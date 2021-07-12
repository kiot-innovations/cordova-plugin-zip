import { deviceReadyEpic } from './deviceReady'
import { deviceResumeEpic, checkForUpdatesEpic } from './deviceResume'
import { nabtoAssociateDeviceEpic } from './nabtoAssociateDevice'
import { nabtoTunnelEpic } from './nabtoTunnel'

export default [
  deviceResumeEpic,
  deviceReadyEpic,
  nabtoAssociateDeviceEpic,
  nabtoTunnelEpic,
  checkForUpdatesEpic
]
