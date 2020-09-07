import React, { useCallback } from 'react'
import { compose } from 'ramda'
import { useDispatch } from 'react-redux'

import AppUpdater from 'components/AppUpdater'
import { APP_UPDATE_OPEN_MARKET } from 'state/actions/global'

function AppUpdaterModal() {
  const dispatch = useDispatch()
  const onUpdate = useCallback(compose(dispatch, APP_UPDATE_OPEN_MARKET), [])

  return <AppUpdater onUpdate={onUpdate} />
}

export default AppUpdaterModal
