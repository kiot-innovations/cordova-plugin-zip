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
  runSystemCheckEpic,
  retrieveStorageStatusEpic,
  getSingleStorageStatusEpic
} from './getHealthCheckEpic'
import {
  checkEqsFwFile,
  getEqsFwFile,
  triggerFwUpdateEpic,
  uploadEqsFwEpic,
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
  getDelayedPreDiscoveryEpic,
  retrieveStorageStatusEpic,
  getSingleStorageStatusEpic
]
