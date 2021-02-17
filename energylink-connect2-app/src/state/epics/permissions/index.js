import { openSettingsEpic } from './openSettingsEpic'
import { checkBLEPermissionsEpic } from './checkBLEPermissionsEpic'
import {
  checkLocationPermissionsEpic,
  showLocationPermissionModalEpic
} from './checkLocationPermissionsEpic'
import { requestLocationPermissionsEpic } from './requestLocationPermissionsEpic'

export default [
  openSettingsEpic,
  checkBLEPermissionsEpic,
  checkLocationPermissionsEpic,
  showLocationPermissionModalEpic,
  requestLocationPermissionsEpic
]
