import firmwareUpdate from './firmwareUpdate'
import gridProfileUpdate from './gridProfileUpdate'

import checkVersionPVS from './checkVersionPVS'

export default [checkVersionPVS, ...firmwareUpdate, ...gridProfileUpdate]
