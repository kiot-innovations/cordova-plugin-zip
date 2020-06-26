import {
  postComponentMappingEpic,
  getComponentMappingEpic
} from './componentMapping'

import { getHealthCheckEpic } from './getHealthCheckEpic'

export default [
  postComponentMappingEpic,
  getComponentMappingEpic,
  getHealthCheckEpic
]
