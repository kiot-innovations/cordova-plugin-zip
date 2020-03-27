import { compose, pick, prop, without } from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import {
  actions,
  utils,
  Canvas,
  Panel,
  PanelsContainer,
  withSelectablePanel,
  withDraggablePanel
} from '@sunpower/panel-layout-tool'
import { renameKey, either } from 'shared/utils'
import './panelLayoutTool.scss'

const EPanel = withSelectablePanel(withDraggablePanel(Panel))

const getPosition = compose(
  utils.roundXY,
  renameKey('offsetX', 'x'),
  renameKey('offsetY', 'y'),
  pick(['offsetX', 'offsetY']),
  prop('evt')
)
export default () => {
  const dispatch = useDispatch()
  const [unassigned, setUnassigned] = useState([
    '12345',
    'ZT12345',
    'ZT1235673',
    'ZT!234asd4',
    'zxcas1234125'
  ])
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

  useEffect(() => {
    dispatch(
      actions.init([
        utils.panelBuilder({ id: '100', x: 130, y: 90 }),
        utils.panelBuilder({ id: '111', x: 130, y: 130 })
      ])
    )
  }, [dispatch])

  const store = useStore()

  return (
    <>
      <Canvas
        store={store}
        width={window.innerWidth}
        height={window.innerHeight - window.innerHeight * 0.25}
        onClick={assign}
      >
        <PanelsContainer PanelComponent={EPanel} />
      </Canvas>
      <h3 className="has-text-centered has-text-white">Add panel to layout</h3>
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
    </>
  )
}
