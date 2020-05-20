import {
  actions,
  GroupsContainer,
  Panel,
  utils,
  withDraggableGroupsContainer,
  withNotOverlappablePanel,
  withSelectableGroupsContainer
} from '@sunpower/panel-layout-tool'
import PanelLayoutTool from 'pages/PanelLayoutTool/Template'
import { path } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { useError } from './hooks'
import './panelLayoutTool.scss'

const EPanel = withNotOverlappablePanel(Panel)
const EGroupsContainer = withSelectableGroupsContainer(
  withDraggableGroupsContainer(GroupsContainer)
)

export default () => {
  const dispatch = useDispatch()
  const t = useI18n()
  const err = useError()
  const panels = useSelector(path(['panel_layout_tool', 'panels']))
  const selectedGroup = useSelector(
    path(['panel_layout_tool', 'selectedGroup'])
  )

  //Had to disable the eslint rule of exhaustive because
  //panels change when the component is mounting and creates an error
  useEffect(() => {
    dispatch(actions.init(utils.createGroups(panels)))
    //eslint-disable-next-line
  }, [])

  const history = useHistory()

  const goToConfigure = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }

  const rotateArray = () => {
    dispatch(actions.rotateSelectedGroup())
  }
  const footer = (
    <div className="pltControlsContainer">
      <div className="sn-buttons">
        <button
          className="button sp-rotate half-button-padding is-secondary trigger-scan mr-10"
          disabled={selectedGroup === -1}
          onClick={rotateArray}
        >
          {t('ROTATE')}
        </button>
      </div>
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
  return (
    <PanelLayoutTool
      instruction={t('GROUP_PANEL_PLT')}
      err={err}
      Container={EGroupsContainer}
      panels={EPanel}
      footer={footer}
    />
  )
}
