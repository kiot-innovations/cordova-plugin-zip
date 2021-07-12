import { propOr, path } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { generateSSID, generatePassword } from 'shared/utils'
import { PVS_CONNECTION_INIT } from 'state/actions/network'

const usePVSInitConnection = () => {
  const dispatch = useDispatch()
  const { SSID, password } = useSelector(propOr({}, 'network'))
  const pvsSN = useSelector(path(['pvs', 'serialNumber']))
  if (!SSID || !password) {
    return () =>
      dispatch(
        PVS_CONNECTION_INIT({
          ssid: generateSSID(pvsSN),
          password: generatePassword(pvsSN)
        })
      )
  }
  return () => dispatch(PVS_CONNECTION_INIT({ ssid: SSID, password }))
}

export default usePVSInitConnection
