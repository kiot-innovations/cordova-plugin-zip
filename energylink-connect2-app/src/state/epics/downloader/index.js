import gridProfile from './gridProfile'
import firmware from './firmware'
import ess from './EssFirmware'
import links from './latestUrls'
import validateDownloadsEpic from './validateFilesEpic'

export default [
  ...gridProfile,
  ...firmware,
  ...ess,
  ...validateDownloadsEpic,
  links
]
