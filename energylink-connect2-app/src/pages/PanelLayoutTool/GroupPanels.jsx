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
import { PLT_SAVE } from '../../state/actions/panel-layout-tool'
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

  const submit = () => {
    dispatch(PLT_SAVE())
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }

  const rotateArray = () => {
    dispatch(actions.rotateSelectedGroup())
  }
  const footer = (
    <div className="plt-rotate-control-container">
      <span className="has-text-white mb-15">Moving array</span>
      <button
        className="button half-button-padding is-secondary sp-rotate trigger-scan is-uppercase"
        disabled={selectedGroup === -1}
        onClick={rotateArray}
      >
        {t('ROTATE')}
      </button>
      <div className="plt-buttons-row mt-15">
        <button className="button is-secondary is-uppercase " onClick={goBack}>
          Back
        </button>
        <button
          className="button is-primary is-uppercase is-center"
          onClick={submit}
        >
          {t('SUBMIT')}
        </button>
      </div>
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
