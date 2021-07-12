import { miLiveDataEpic } from './miLiveDataEpic'
import { pvsScanEpic } from './pvsScanEpic'
import { setMetaDataEpic } from './setMetaDataEpic'
import setPVSModelEpic from './setPVSModelEpic'
import { startDiscoveryEpic } from './startDiscoveryEpic'

export default [
  pvsScanEpic,
  startDiscoveryEpic,
  setMetaDataEpic,
  miLiveDataEpic,
  setPVSModelEpic
]
