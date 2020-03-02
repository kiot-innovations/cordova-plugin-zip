import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import routes from 'routes/paths'
import { RESET_FIRMWARE_UPDATE } from 'state/actions/firmwareUpdate'

const useUpgrade = () => {
  const { upgrading, status } = useSelector(state => state.firmwareUpdate)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(() => {
    if (upgrading) {
      history.push(routes.PROTECTED.UPDATE.path)
    }
    if (!upgrading && status === 'UPGRADE_COMPLETE') {
      dispatch(RESET_FIRMWARE_UPDATE())
      history.push(routes.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
  }, [dispatch, upgrading, history, location.pathname, status])
}

export default useUpgrade
