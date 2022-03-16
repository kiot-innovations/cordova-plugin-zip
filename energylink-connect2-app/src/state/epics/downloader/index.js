import ess from './EssFirmware'
import firmware from './firmware'
import gridProfile from './gridProfile'
import pvsUpdateUrls from './latestUrls'
import pvs5Firmware from './pvs5Fw.epic'

export default [
  ...gridProfile,
  ...firmware,
  ...ess,
  ...pvsUpdateUrls,
  ...pvs5Firmware
]
