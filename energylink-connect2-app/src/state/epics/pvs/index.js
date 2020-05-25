import { pvsScanEpic } from './pvsScanEpic'
import { startDiscoveryEpic } from './startDiscoveryEpic'
import { setMetaDataEpic } from './setMetaDataEpic'
import { miLiveDataEpic } from './miLiveDataEpic'

export default [
  pvsScanEpic,
  startDiscoveryEpic,
  setMetaDataEpic,
  miLiveDataEpic
]
