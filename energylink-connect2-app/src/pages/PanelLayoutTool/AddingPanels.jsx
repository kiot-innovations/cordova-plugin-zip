import {
  actions,
  Control,
  Panel,
  utils,
  withDraggablePanel,
  withNotOverlappablePanel,
  withSelectablePanel
} from '@sunpower/panel-layout-tool'
import {
  compose,
  length,
  map,
  pathOr,
  pick,
  prop,
  propEq,
  filter,
  without
} from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, renameKey } from 'shared/utils'
import { PLT_LOAD } from 'state/actions/panel-layout-tool'
import { useError } from './hooks'
import './panelLayoutTool.scss'
import PanelLayoutTool from './Template'

const getEPanel = compose(
  withNotOverlappablePanel,
  withSelectablePanel,
  withDraggablePanel
)

const EPanel = getEPanel(Panel)

const getPosition = compose(
  utils.roundXY,
  renameKey('offsetX', 'x'),
  renameKey('offsetY', 'y'),
  pick(['offsetX', 'offsetY']),
  prop('evt')
)

const getSerialNumbers = compose(
  filter(propEq('DEVICE_TYPE', 'Inverter')),
  pathOr([], ['devices', 'found'])
)

const StepHeader = ({ name, panelsAdded, panelsAvailable }) => (
  <div className="step">
    <span className="mr-10 has-text-weight-bold">
      {panelsAdded}/{panelsAvailable}
    </span>
    <span className="step-name">{name}</span>
  </div>
)

export default () => {
  const dispatch = useDispatch()
  const t = useI18n()
  const serialNumbers = useSelector(getSerialNumbers)
  const panels = useSelector(pathOr([], ['panel_layout_tool', 'panels']))
  const selected = useSelector(pathOr([], ['panel_layout_tool', 'selected']))
  const err = useError()
  const unassigned = without(
    map(prop('id'), panels),
    map(prop('SERIAL'), serialNumbers)
  )

  useEffect(() => {
    dispatch(PLT_LOAD())
  }, [dispatch])

  const [index, setIndex] = useState(0)

  const assign = useCallback(
    e => {
      if (!unassigned[index]) return
      const position = getPosition(e)
      setIndex(index > 0 ? index - 1 : 0)
      dispatch(
        actions.add(
          utils.panelBuilder({
            id: unassigned[index],
            ...position
          })
        )
      )
    },
    [unassigned, dispatch, index]
  )

  const history = useHistory()

  const goToConfigureArrays = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL_GROUPS.path)
  }
  const footer = either(
    unassigned.length || err,
    <div>
      <h3 className="has-text-centered has-text-white">
        {t('ADD_PANEL_TO_LAYOUT')}
      </h3>
      <div className="plt-add-control-container">
        {either(
          index !== 0,
          <button
            value={'<'}
            onClick={() => setIndex(index - 1)}
            className="plt-button"
          >
            {'<'}
          </button>,
          <span />
        )}
        <span>{unassigned[index]}</span>
        {either(
          index < unassigned.length - 1,
          <button
            value={'>'}
            onClick={() => setIndex(index + 1)}
            className="plt-button"
          >
            {'>'}
          </button>
        )}
      </div>
    </div>,
    <div>
      <div className="all-panels-set">
        <span className="has-text-centered has-text-white has-text-weight-bold is-size-7">
          {t('ALL_PANELS_SET')}!
        </span>
        <span className="has-text-centered">{t('CONTINUE_TO_ADJUST')}</span>
        <button
          className="button is-primary is-uppercase is-center"
          onClick={goToConfigureArrays}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
  return (
    <PanelLayoutTool
      err={err}
      stepHeader={
        <StepHeader
          name={t('PLT_MODULES_PLACED')}
          panelsAvailable={length(serialNumbers)}
          panelsAdded={length(panels)}
        />
      }
      instruction={t('ADD_PANEL_PLT')}
      onClick={assign}
      panels={EPanel}
      controls={
        <>
          <Control
            icon="sp-rotate"
            disabled={selected === -1}
            onClick={() => dispatch(actions.setRotation())}
          />
          <Control
            icon="sp-trash"
            disabled={selected === -1}
            onClick={() => dispatch(actions.remove())}
          />
        </>
      }
      footer={footer}
    />
  )
}
