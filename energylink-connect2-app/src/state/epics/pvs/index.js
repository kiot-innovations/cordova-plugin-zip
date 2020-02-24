import { pvsScanEpic } from './pvsScanEpic'
import { startCommissioningEpic } from './startCommissioningEpic'
import { startDiscoveryEpic } from './startDiscoveryEpic'
import { setMetaDataEpic } from './setMetaDataEpic'

export default [
  pvsScanEpic,
  startCommissioningEpic,
  startDiscoveryEpic,
  setMetaDataEpic
]
