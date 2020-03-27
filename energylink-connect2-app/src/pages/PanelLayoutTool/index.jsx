import React, { useCallback, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'

import {
  actions,
  utils,
  Canvas,
  Panel,
  PanelsContainer,
  withSelectablePanel
} from '@sunpower/panel-layout-tool'

const EPanel = withSelectablePanel(Panel)

export default () => {
  const dispatch = useDispatch()
  const assign = useCallback(e => {
    // console.log('assign')
  }, [])

  useEffect(() => {
    dispatch(
      actions.init([
        utils.panelBuilder({ id: '10', x: 130, y: 90 }),
        utils.panelBuilder({ id: '11', x: 130, y: 130 })
      ])
    )
  }, [dispatch])

  const store = useStore()

  return (
    <Canvas
      store={store}
      width={window.innerWidth}
      height={window.innerHeight - 200}
      onClick={assign}
    >
      <PanelsContainer PanelComponent={EPanel} />
    </Canvas>
  )
}
