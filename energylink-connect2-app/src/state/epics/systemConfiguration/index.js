import fetchBatteriesEpic from 'state/epics/systemConfiguration/fetchBatteriesEpic'
import { fetchGridBehaviorEpic } from './fetchGridBehavior'
import { fetchNetworkAPsEpic } from './fetchNetworkAPsEpic'
import { connectNetworkAPEpic } from './connectNetworkAPEpic'
import { submitConfigurationEpic } from './submitConfigEpic'

export default [
  fetchGridBehaviorEpic,
  fetchNetworkAPsEpic,
  connectNetworkAPEpic,
  submitConfigurationEpic,
  fetchBatteriesEpic
]
