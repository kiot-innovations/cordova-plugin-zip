import { deviceResumeEpic, checkForUpdatesEpic } from './deviceResume'
import { deviceReadyEpic } from './deviceReady'
import { nabtoAssociateDeviceEpic } from './nabtoAssociateDevice'
import { nabtoTunnelEpic } from './nabtoTunnel'
import { webServerEpic } from './webserverEpic'

export default [
  deviceResumeEpic,
  deviceReadyEpic,
  nabtoAssociateDeviceEpic,
  nabtoTunnelEpic,
  webServerEpic,
  checkForUpdatesEpic
]
