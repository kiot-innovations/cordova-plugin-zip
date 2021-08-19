import { connectNetworkAPEpic } from './connectNetworkAPEpic'
import { fetchGridBehaviorEpic } from './fetchGridBehavior'
import { fetchInterfacesEpic } from './fetchInterfacesEpic'
import { fetchNetworkAPsEpic } from './fetchNetworkAPsEpic'
import { fetchRSEEpic } from './fetchRSEEpic'
import { replaceRmaPvsEpic } from './replaceRmaPvsEpic'
import { setRSEEpic, pollRSEEpic } from './setRSEEpic'
import {
  submitMeterDataEpic,
  submitGridProfileEpic,
  submitExportLimitEpic,
  submitGridVoltageEpic,
  submitCTRatedCurrentEpic
} from './submitConfigEpic'
import {
  submitConfigObjectEpic,
  submitConfigSuccessEpic,
  submitStringInvertersEpic
} from './submitConfigObjectEpic'
import {
  submitPreConfigGridProfileEpic,
  submitPreConfigMeterDataEpic
} from './submitPreconfiguration/submitPreconfigurationEpic'
import { wpsSupportEpic } from './wpsSupportEpic'

import { fetchBatteriesEpic } from 'state/epics/systemConfiguration/fetchBatteriesEpic'

export default [
  fetchGridBehaviorEpic,
  fetchNetworkAPsEpic,
  connectNetworkAPEpic,
  wpsSupportEpic,
  replaceRmaPvsEpic,
  submitConfigObjectEpic,
  submitStringInvertersEpic,
  submitConfigSuccessEpic,
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
