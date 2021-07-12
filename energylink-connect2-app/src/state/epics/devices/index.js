import { claimDevicesEpic } from './claimDevices'
import { scanDevicesEpic } from './discoverDevices'
import { fetchDeviceListEpic } from './fetchDeviceList'
import { fetchModelsEpic } from './fetchModels'
import { fetchCandidatesEpic } from './pollCandidates'
import { pollClaimingEpic } from './pollClaiming'
import { pushCandidatesEpic } from './pushCandidates'

export default [
  pushCandidatesEpic,
  fetchCandidatesEpic,
  scanDevicesEpic,
  claimDevicesEpic,
  pollClaimingEpic,
  fetchModelsEpic,
  fetchDeviceListEpic
]
