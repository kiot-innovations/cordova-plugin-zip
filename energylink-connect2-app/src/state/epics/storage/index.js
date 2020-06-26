import { getPreDiscoveryEpic } from './preDiscovery'
import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'

import { getHealthCheckEpic } from './getHealthCheckEpic'

export default [
  getPreDiscoveryEpic,
  postComponentMappingEpic,
  getComponentMappingEpic,
  getHealthCheckEpic
]
