import {
  actions,
  GroupsContainer,
  Panel,
  utils,
  withDraggableGroupsContainer,
  withNotOverlappablePanel
} from '@sunpower/panel-layout-tool'
import { path } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { useError } from './hooks'
import './panelLayoutTool.scss'
import PanelLayoutTool from './Template'

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

  const history = useHistory()

  const goToConfigure = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }
  const footer = (
    <>
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
    </>
  )
  return (
    <PanelLayoutTool
      footer={footer}
      err={err}
      panels={EPanel}
      Container={EGroupsContainer}
      instruction={t('GROUP_PANEL_PLT')}
    />
  )
}
