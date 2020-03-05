import { claimDevicesEpic } from './claimDevices'
import { pollClaimingEpic } from './pollClaiming'
import { scanDevicesEpic } from './discoverDevices'
import { pushCandidatesEpic } from './pushCandidates'
import { fetchCandidatesEpic } from './pollCandidates'

export default [
  pushCandidatesEpic,
  fetchCandidatesEpic,
  scanDevicesEpic,
  claimDevicesEpic,
  pollClaimingEpic
]
