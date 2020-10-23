import paths from 'routes/paths'
import GiveFeedback from 'pages/GiveFeedback'
import Firmwares from 'pages/Firmwares'
import VersionInformation from 'pages/VersionInformation'

export default [
  {
    icon: 'sp-map',
    text: 'CHANGE_ADDRESS',
    to: paths.PROTECTED.ROOT.path
  },
  {
    icon: 'sp-update',
    text: 'MANAGE_FIRMWARES',
    component: Firmwares
  },
  {
    icon: 'sp-info',
    text: 'VERSION_INFORMATION',
    component: VersionInformation
  },
  {
    icon: 'sp-feedback',
    text: 'GIVE_FEEDBACK',
    component: GiveFeedback
  }
]
