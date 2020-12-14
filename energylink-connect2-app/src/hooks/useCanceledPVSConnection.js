/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { includes } from 'ramda'
import paths from 'routes/paths'

const useCanceledPVSConnection = () => {
  const history = useHistory()
  const currentRoute = history.location.pathname

  /*----------------------
  Place here all routes that you think that should not redirect you to the
  Connection Lost page
  ------------------------*/
  const whitelist = [
    paths.PROTECTED.PVS_SELECTION_SCREEN.path,
    paths.PROTECTED.CONNECT_TO_PVS.path,
    paths.PROTECTED.UPDATE.path
  ]

  const { connectionCanceled } = useSelector(state => state.network)

  useEffect(() => {
    if (connectionCanceled && !includes(currentRoute, whitelist)) {
      history.push(paths.PROTECTED.CONNECTION_LOST.path)
    }
  }, [connectionCanceled])
}

export default useCanceledPVSConnection
