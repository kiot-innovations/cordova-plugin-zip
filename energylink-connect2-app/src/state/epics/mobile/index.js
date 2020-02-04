import { deviceResumeEpic } from './deviceResume'
import { deviceReadyEpic } from './deviceReady'
import { nabtoAssociateDeviceEpic } from './nabtoAssociateDevice'
import { nabtoTunnelEpic } from './nabtoTunnel'

export default [
  deviceResumeEpic,
  deviceReadyEpic,
  nabtoAssociateDeviceEpic,
  nabtoTunnelEpic
]
