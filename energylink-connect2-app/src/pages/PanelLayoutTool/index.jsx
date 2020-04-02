import {
  actions,
  Canvas,
  Panel,
  PanelsContainer,
  RotationSelector,
  utils,
  withDraggablePanel,
  withNotOverlappablePanel,
  withSelectablePanel
} from '@sunpower/panel-layout-tool'
import { compose, pathOr, pick, prop, without } from 'ramda'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, renameKey } from 'shared/utils'
import './panelLayoutTool.scss'
import { useError } from './hooks'

const EPanel = withNotOverlappablePanel(
  withSelectablePanel(withDraggablePanel(Panel))
)

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
  const serialNumbers = useSelector(({ pvs }) => pvs.serialNumbers)
  const panels = useSelector(pathOr([], ['panel_layout_tool', 'panels']))
  const err = useError()
  const [unassigned, setUnassigned] = useState(
    without(
      panels.map(({ id }) => id),
      serialNumbers.map(({ serial_number }) => serial_number)
    )
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

  const store = useStore()
  const history = useHistory()

  const goToConfigureArrays = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL_GROUPS.path)
  }

  return (
    <div className={'plt-screen-container'}>
      <h1 className="is-uppercase has-text-centered">
        {t('PANEL_LAYOUT_DESIGNER')}
      </h1>
      {either(
        err,
        <span className="has-text-centered has-error-text">{t(err)}</span>,
        <span className="has-text-centered has-text-white">
          {t('ADD_PANEL_PLT')}
        </span>
      )}
      <Canvas
        store={store}
        width={window.innerWidth - 30}
        height={window.innerWidth - 30}
        onClick={assign}
      >
        <PanelsContainer PanelComponent={EPanel} />
      </Canvas>
      {either(
        unassigned.length || err,
        <>
          <h3 className="has-text-centered has-text-white">
            Add panel to layout
          </h3>
          <div className="panelContainer">
            {either(
              index !== 0,
              <button value={'<'} onClick={() => setIndex(index - 1)}>
                {'<'}
              </button>,
              <span />
            )}
            <span>{unassigned[index]}</span>
            {either(
              index < unassigned.length - 1,
              <button value={'>'} onClick={() => setIndex(index + 1)}>
                {'>'}
              </button>
            )}
          </div>
          <span className="has-text-centered has-text-weight-bold has-text-white">
            orientation
          </span>
          <RotationSelector />
        </>,
        <>
          <span className="has-text-centered has-text-weight-bold has-text-white">
            orientation
          </span>
          <RotationSelector />
          <span className="has-text-centered has-text-white has-text-weight-bold">
            All panels set!
          </span>
          <span className="has-text-centered">Continue to adjust arrays</span>
          <button
            className="button is-primary is-uppercase is-center"
            onClick={goToConfigureArrays}
          >
            continue
          </button>
        </>
      )}
    </div>
  )
}
