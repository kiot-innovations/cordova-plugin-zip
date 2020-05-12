import { fetchBatteriesEpic } from 'state/epics/systemConfiguration/fetchBatteriesEpic'
import { fetchGridBehaviorEpic } from './fetchGridBehavior'
import { fetchNetworkAPsEpic } from './fetchNetworkAPsEpic'
import { connectNetworkAPEpic } from './connectNetworkAPEpic'
import { fetchInterfacesEpic } from './fetchInterfacesEpic'
import { fetchRSEEpic } from './fetchRSEEpic'
import { setRSEEpic, pollRSEEpic } from './setRSEEpic'
import { submitConfigObjectEpic } from './submitConfigObjectEpic'
import {
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic
} from './submitConfigEpic'

export default [
  fetchGridBehaviorEpic,
  fetchNetworkAPsEpic,
  connectNetworkAPEpic,
  submitConfigObjectEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic,
  fetchBatteriesEpic,
  fetchInterfacesEpic,
  fetchRSEEpic,
  setRSEEpic,
  pollRSEEpic,
  submitConfigObjectEpic
]
