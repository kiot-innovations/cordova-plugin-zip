import { claimDevicesEpic } from './claimDevices'
import { pollClaimingEpic } from './pollClaiming'
import { scanDevicesEpic } from './discoverDevices'
import { pushCandidatesEpic } from './pushCandidates'
import { fetchCandidatesEpic } from './pollCandidates'
import { fetchModelsEpic, loadBackupModelsEpic } from './fetchModels'
import { fetchDeviceListEpic } from './fetchDeviceList'

export default [
  pushCandidatesEpic,
  fetchCandidatesEpic,
  scanDevicesEpic,
  claimDevicesEpic,
  pollClaimingEpic,
  fetchModelsEpic,
  loadBackupModelsEpic,
  fetchDeviceListEpic
]
