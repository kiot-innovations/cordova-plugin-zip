import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'
import {
  checkEqsFwFile,
  getEqsFwFile,
  triggerFwUpdateEpic,
  uploadEqsFwEpic,
  pollFwUpdateEpic
} from './deviceUpdate'
import {
  startHealthCheckEpic,
  waitHealthCheckEpic,
  errorHealthCheckEpic,
  getHealthCheckEpic,
  runSystemCheckEpic,
  retrieveStorageStatusEpic,
  getSingleStorageStatusEpic
} from './getHealthCheckEpic'
import { getPreDiscoveryEpic, getDelayedPreDiscoveryEpic } from './preDiscovery'

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
  getDelayedPreDiscoveryEpic,
  retrieveStorageStatusEpic,
  getSingleStorageStatusEpic
]
