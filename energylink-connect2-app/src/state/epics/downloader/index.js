import gridProfile from './gridProfile'
import firmware from './firmware'
import downloader from './downloader'
import ess from './EssFirmware'

export default [...downloader, ...gridProfile, ...firmware, ...ess]
