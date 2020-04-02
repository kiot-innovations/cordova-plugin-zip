import {
  actions,
  Canvas,
  Panel,
  GroupsContainer,
  utils,
  withDraggableGroupsContainer,
  withNotOverlappablePanel
} from '@sunpower/panel-layout-tool'
import React, { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import './panelLayoutTool.scss'

const EPanel = withNotOverlappablePanel(Panel)
const EGroupsContainer = withDraggableGroupsContainer(GroupsContainer)

export default () => {
  const dispatch = useDispatch()
  const panels = useSelector(
    ({ panel_layout_tool }) => panel_layout_tool.panels
  )

  useEffect(() => {
    dispatch(actions.init(utils.createGroups(panels)))
  }, [dispatch, panels])

  const store = useStore()
  const history = useHistory()

  const goToConfigure = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Canvas
        store={store}
        width={window.innerWidth - 30}
        height={window.innerHeight - 30}
      >
        <EGroupsContainer PanelComponent={EPanel} />
      </Canvas>
      <div className="panelContainer" />
      <button
        style={{ alignSelf: 'center' }}
        className="button is-primary is-uppercase is-center mt-10"
        onClick={goBack}
      >
        Back
      </button>
      <button
        style={{ alignSelf: 'center' }}
        className="button is-primary is-uppercase is-center mt-10"
        onClick={goToConfigure}
      >
        Go to configure
      </button>
    </div>
  )
}
