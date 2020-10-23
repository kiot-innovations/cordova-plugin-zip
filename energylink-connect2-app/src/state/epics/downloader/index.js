import gridProfile from './gridProfile'
import firmware from './firmware'
import ess from './EssFirmware'
import downloadModalEpics from './downloadModalEpics'
import links from './latestUrls'

export default [
  ...gridProfile,
  ...firmware,
  ...ess,
  ...downloadModalEpics,
  links
]
