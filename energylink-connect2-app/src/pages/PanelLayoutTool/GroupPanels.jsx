import {
  actions,
  Control,
  GroupsContainer,
  Panel,
  utils,
  withDraggableGroupsContainer,
  withNotOverlappablePanel,
  withSelectableGroupsContainer
} from '@sunpower/panel-layout-tool'
import PanelLayoutTool from 'pages/PanelLayoutTool/Template'
import { Redirect } from 'react-router-dom'
import { path, prop } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { PLT_SAVE } from 'state/actions/panel-layout-tool'
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
  const { saving, saved, error } = useSelector(prop('pltWizard'))
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
  }

  const goBack = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
  }

  const rotateArray = () => {
    dispatch(actions.rotateSelectedGroup())
  }
  const footer = (
    <div className="plt-rotate-control-container">
      <div className="plt-buttons-row mt-15">
        <button className="button is-secondary is-uppercase " onClick={goBack}>
          Back
        </button>
        <button
          className="button is-primary is-uppercase is-center"
          onClick={submit}
          disabled={saving}
        >
          {saving ? t('SAVING') : t('SUBMIT')}
        </button>
        {saved && <Redirect to={paths.PROTECTED.SYSTEM_CONFIGURATION.path} />}
      </div>
      {error && (
        <div className="has-text-centered has-error-text is-size-7">
          {t(error)}
        </div>
      )}
    </div>
  )
  return (
    <PanelLayoutTool
      instruction={t('GROUP_PANEL_PLT')}
      err={err}
      Container={EGroupsContainer}
      panels={EPanel}
      controls={
        <>
          <Control
            icon="sp-rotate"
            disabled={selectedGroup === -1}
            onClick={rotateArray}
          />
        </>
      }
      footer={footer}
    />
  )
}
