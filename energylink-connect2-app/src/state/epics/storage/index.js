import { getPreDiscoveryEpic } from './preDiscovery'
import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'

export default [
  getPreDiscoveryEpic,
  postComponentMappingEpic,
  getComponentMappingEpic
]
