import {
  actions,
  Canvas,
  Panel,
  GroupsContainer,
  utils,
  withDraggableGroupsContainer,
  withNotOverlappablePanel
} from '@sunpower/panel-layout-tool'
import { path } from 'ramda'
import { useI18n } from 'shared/i18n'
import React, { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import './panelLayoutTool.scss'
import { either } from 'shared/utils'
import { useError } from './hooks'

const EPanel = withNotOverlappablePanel(Panel)
const EGroupsContainer = withDraggableGroupsContainer(GroupsContainer)

export default ({ animationState }) => {
  const dispatch = useDispatch()
  const t = useI18n()
  const err = useError()
  const panels = useSelector(path(['panel_layout_tool', 'panels']))

  //Had to disable the eslint rule of exhaustive because
  //panels change when the component is mounting and creates an error
  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(actions.init(utils.createGroups(panels)))
    }
    //eslint-disable-next-line
  }, [])

  const store = useStore()
  const history = useHistory()

  const goToConfigure = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }

  return (
    <div className="plt-screen-container">
      <h1 className="is-uppercase has-text-centered">
        {t('PANEL_LAYOUT_DESIGNER')}
      </h1>
      {either(
        err,
        <span className="has-text-centered has-error-text">{t(err)}</span>,
        <span className="has-text-centered has-text-white">
          {t('GROUP_PANEL_PLT')}
        </span>
      )}
      <Canvas
        store={store}
        width={window.innerWidth - 30}
        height={window.innerWidth - 30}
      >
        <EGroupsContainer PanelComponent={EPanel} />
      </Canvas>
      <div className="panelContainer" />
      <button
        className="button-transparent has-text-primary is-uppercase is-center has-text-weight-bold"
        onClick={goBack}
      >
        Back
      </button>
      <button
        className="button is-primary is-uppercase is-center mt-10"
        onClick={goToConfigure}
      >
        Go to configure
      </button>
    </div>
  )
}
