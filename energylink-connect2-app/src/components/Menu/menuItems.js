import DebugPage from 'pages/DebugPage'
import FirmwareReleaseNotes from 'pages/FirmwareReleaseNotes'
import FirmwaresMenu from 'pages/Firmwares/MenuComponent'
import GiveFeedback from 'pages/GiveFeedback'
import Settings from 'pages/Settings'
import TroubleshootingGuides from 'pages/TroubleshootingGuides'
import VersionInformation from 'pages/VersionInformation'
import paths from 'routes/paths'

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
    component: FirmwaresMenu,
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
  },
  {
    icon: 'sp-guide',
    text: 'KNOWLEDGE_BASE',
    to: paths.PROTECTED.KNOWLEDGE_BASE.path,
    display: true
  },
  {
    icon: 'sp-gear',
    text: 'SETTINGS',
    component: Settings,
    display: true
  },
  {
    icon: 'sp-help',
    text: 'TROUBLESHOOTING_GUIDES',
    component: TroubleshootingGuides,
    display: true
  },
  {
    icon: 'sp-gear',
    text: 'Superuser Options',
    component: DebugPage,
    display: process.env.REACT_APP_FLAVOR === 'cm2-test'
  }
]
