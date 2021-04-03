import { openSettingsEpic } from './openSettingsEpic'
import { checkBLEPermissionsEpic } from './checkBLEPermissionsEpic'
import {
  checkLocationPermissionsEpic,
  showLocationPermissionModalEpic
} from './checkLocationPermissionsEpic'
import { requestLocationPermissionsEpic } from './requestLocationPermissionsEpic'
import { checkTrackingPermissionsEpic } from './checkTrackingPermissionsEpic'
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
