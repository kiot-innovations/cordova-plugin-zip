import paths from 'routes/paths'
import GiveFeedback from 'pages/GiveFeedback'
import Firmwares from 'pages/Firmwares'
import VersionInformation from 'pages/VersionInformation'
import FirmwareReleaseNotes from 'pages/FirmwareReleaseNotes'

export default [
  {
    icon: 'sp-map',
    text: 'CHANGE_ADDRESS',
    to: paths.PROTECTED.ROOT.path,
    display: true
  },
  {
    icon: 'sp-update',
    text: 'MANAGE_FIRMWARES',
    component: Firmwares,
    display: true
  },
  {
    icon: 'sp-info',
    text: 'VERSION_INFORMATION',
    component: VersionInformation,
    display: true
  },
  {
    icon: 'sp-feedback',
    text: 'GIVE_FEEDBACK',
    component: GiveFeedback,
    display: true
  },
  {
    text: 'FIRMWARE_RELEASE_NOTES',
    component: FirmwareReleaseNotes,
    display: false
  }
]
