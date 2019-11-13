import { paths } from 'routes/paths'

export default [
  {
    icon: 'sp-map',
    text: 'CHANGE_ADDRESS',
    to: paths.PROTECTED.ROOT
  },
  {
    icon: 'sp-map',
    text: 'MANAGE_FIRMWARES',
    to: paths.PROTECTED.MANAGE_FIRMWARES
  },
  {
    icon: 'sp-map',
    text: 'VERSION_INFORMATION',
    to: paths.PROTECTED.VERSION_INFORMATION
  },
  {
    icon: 'sp-map',
    text: 'GIVE_FEEDBACK',
    to: paths.PROTECTED.GIVE_FEEDBACK
  }
]
