import ess from './EssFirmware'
import firmware from './firmware'
import gridProfile from './gridProfile'
import pvsUpdateUrls from './latestUrls'

export default [...gridProfile, ...firmware, ...ess, ...pvsUpdateUrls]
