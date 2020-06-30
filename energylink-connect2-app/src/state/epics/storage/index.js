import { getPreDiscoveryEpic } from './preDiscovery'
import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'
import { getHealthCheckEpic } from './getHealthCheckEpic'
import {
  uploadEqsFwEpic,
  triggerFwUpdateEpic,
  pollFwUpdateEpic
} from './deviceUpdate'

export default [
  uploadEqsFwEpic,
  triggerFwUpdateEpic,
  pollFwUpdateEpic,
  postComponentMappingEpic,
  getComponentMappingEpic,
  getHealthCheckEpic,
  getPreDiscoveryEpic
]
