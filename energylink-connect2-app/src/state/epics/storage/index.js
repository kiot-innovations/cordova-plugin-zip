import { getPreDiscoveryEpic, getDelayedPreDiscoveryEpic } from './preDiscovery'
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
  checkEqsFwFile,
  getEqsFwFile,
  uploadEqsFwEpic,
  triggerFwUpdateEpic,
  pollFwUpdateEpic
} from './deviceUpdate'

export default [
  checkEqsFwFile,
  getEqsFwFile,
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
  getPreDiscoveryEpic,
  getDelayedPreDiscoveryEpic
]
