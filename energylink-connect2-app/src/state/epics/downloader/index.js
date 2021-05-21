import gridProfile from './gridProfile'
import firmware from './firmware'
import ess from './EssFirmware'
import pvsUpdateUrls from './latestUrls'

export default [...gridProfile, ...firmware, ...ess, ...pvsUpdateUrls]
