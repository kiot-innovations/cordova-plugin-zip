import checkVersionPVS from './checkVersionPVS'
import firmwareUpdate from './firmwareUpdate'
import gridProfileUpdate from './gridProfileUpdate'

export default [checkVersionPVS, ...firmwareUpdate, ...gridProfileUpdate]
