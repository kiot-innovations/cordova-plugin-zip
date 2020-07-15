import { getPreDiscoveryEpic } from './preDiscovery'
import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'
import {
  startHealthCheckEpic,
  waitHealthCheckEpic,
  errorHealthCheckEpic,
  getHealthCheckEpic,
  runSystemCheckEpic
} from './getHealthCheckEpic'
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
  startHealthCheckEpic,
  waitHealthCheckEpic,
  errorHealthCheckEpic,
  getHealthCheckEpic,
  runSystemCheckEpic,
  getPreDiscoveryEpic
]
