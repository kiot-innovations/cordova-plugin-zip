import { checkBLEPermissionsEpic } from './checkBLEPermissionsEpic'
import {
  checkLocationPermissionsEpic,
  showLocationPermissionModalEpic
} from './checkLocationPermissionsEpic'
import { checkTrackingPermissionsEpic } from './checkTrackingPermissionsEpic'
import { openSettingsEpic } from './openSettingsEpic'
import { requestLocationPermissionsEpic } from './requestLocationPermissionsEpic'
import { requestTrackingPermissionsEpic } from './requestTrackingPermissionsEpic'

export default [
  openSettingsEpic,
  checkBLEPermissionsEpic,
  checkLocationPermissionsEpic,
  showLocationPermissionModalEpic,
  requestLocationPermissionsEpic,
  checkTrackingPermissionsEpic,
  requestTrackingPermissionsEpic
]
