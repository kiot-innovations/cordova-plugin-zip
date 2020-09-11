import { fetchBatteriesEpic } from 'state/epics/systemConfiguration/fetchBatteriesEpic'
import { fetchGridBehaviorEpic } from './fetchGridBehavior'
import { fetchNetworkAPsEpic } from './fetchNetworkAPsEpic'
import { connectNetworkAPEpic } from './connectNetworkAPEpic'
import { fetchInterfacesEpic } from './fetchInterfacesEpic'
import { fetchRSEEpic } from './fetchRSEEpic'
import { setRSEEpic, pollRSEEpic } from './setRSEEpic'
import { replaceRmaPvsEpic } from './replaceRmaPvsEpic'
import { submitConfigObjectEpic } from './submitConfigObjectEpic'
import { reportCommissionErrorEpic } from './reportCommissionErrorEpic'
import {
  submitMeterDataEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic
} from './submitConfigEpic'

export default [
  fetchGridBehaviorEpic,
  fetchNetworkAPsEpic,
  connectNetworkAPEpic,
  replaceRmaPvsEpic,
  submitConfigObjectEpic,
  submitMeterDataEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic,
  fetchBatteriesEpic,
  fetchInterfacesEpic,
  fetchRSEEpic,
  setRSEEpic,
  pollRSEEpic,
  reportCommissionErrorEpic
]
