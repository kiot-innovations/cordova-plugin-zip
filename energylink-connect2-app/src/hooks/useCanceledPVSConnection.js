/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import routes from 'routes/paths'

const useCanceledPVSConnection = () => {
  const history = useHistory()

  const { connectionCanceled } = useSelector(state => state.network)

  useEffect(() => {
    if (connectionCanceled) {
      history.push(routes.PROTECTED.CONNECTION_LOST.path)
    }
  }, [connectionCanceled])
}

export default useCanceledPVSConnection
