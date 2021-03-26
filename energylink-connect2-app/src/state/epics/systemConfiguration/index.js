import { fetchBatteriesEpic } from 'state/epics/systemConfiguration/fetchBatteriesEpic'
import { fetchGridBehaviorEpic } from './fetchGridBehavior'
import { fetchNetworkAPsEpic } from './fetchNetworkAPsEpic'
import { connectNetworkAPEpic } from './connectNetworkAPEpic'
import { wpsSupportEpic } from './wpsSupportEpic'
import { fetchInterfacesEpic } from './fetchInterfacesEpic'
import { fetchRSEEpic } from './fetchRSEEpic'
import { setRSEEpic, pollRSEEpic } from './setRSEEpic'
import { replaceRmaPvsEpic } from './replaceRmaPvsEpic'
import { submitConfigObjectEpic } from './submitConfigObjectEpic'
import {
  submitMeterDataEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic,
  submitCTRatedCurrentEpic
} from './submitConfigEpic'
import {
  submitPreConfigGridProfileEpic,
  submitPreConfigMeterDataEpic
} from './submitPreconfiguration/submitPreconfigurationEpic'

export default [
  fetchGridBehaviorEpic,
  fetchNetworkAPsEpic,
  connectNetworkAPEpic,
  wpsSupportEpic,
  replaceRmaPvsEpic,
  submitConfigObjectEpic,
  submitMeterDataEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic,
  submitCTRatedCurrentEpic,
  fetchBatteriesEpic,
  fetchInterfacesEpic,
  fetchRSEEpic,
  setRSEEpic,
  pollRSEEpic,
  submitPreConfigGridProfileEpic,
  submitPreConfigMeterDataEpic
]
