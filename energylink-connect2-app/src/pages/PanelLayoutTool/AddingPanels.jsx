import {
  actions,
  Panel,
  RotationSelector,
  utils,
  withDraggablePanel,
  withNotOverlappablePanel,
  withSelectablePanel
} from '@sunpower/panel-layout-tool'
import { compose, map, pathOr, pick, prop, without } from 'ramda'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, renameKey } from 'shared/utils'
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

export default () => {
  const dispatch = useDispatch()
  const t = useI18n()
  const serialNumbers = useSelector(pathOr([], ['pvs', 'serialNumbers']))
  const panels = useSelector(pathOr([], ['panel_layout_tool', 'panels']))
  const err = useError()
  const [unassigned, setUnassigned] = useState(
    without(map(prop('id'), panels), map(prop('serial_number'), serialNumbers))
  )

  const [index, setIndex] = useState(0)

  const assign = useCallback(
    e => {
      if (!unassigned[index]) return
      const position = getPosition(e)
      setUnassigned(without(unassigned[index], unassigned))
      setIndex(index > 0 ? index - 1 : 0)
      dispatch(
        actions.add({
          id: unassigned[index],
          ...position
        })
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
      <div className="has-text-centered has-text-weight-bold has-text-white is-size-7 is-capitalized">
        {t('ORIENTATION')}
      </div>
      <RotationSelector />
    </div>,
    <div>
      <div className="has-text-centered has-text-weight-bold has-text-white is-size-7 is-capitalized">
        {t('ORIENTATION')}
      </div>
      <RotationSelector />
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
      instruction={t('ADD_PANEL_PLT')}
      onClick={assign}
      panels={EPanel}
      footer={footer}
    />
  )
}
