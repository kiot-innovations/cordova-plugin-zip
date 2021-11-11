import { storiesOf } from '@storybook/react'
import { always, evolve } from 'ramda'
import React from 'react'
import { Provider } from 'react-redux'

import SystemChecksACPV from '.'

import { SYSTEM_CHECKS_STATUS } from 'state/reducers/systemChecks'
import { configureStore } from 'state/store'

export const systemChecksDefaultState = {
  pvs: {
    fwVersion: 60002
  },
  systemChecks: {
    productionCTProgress: 0,
    productionCTErrors: [],
    productionCTStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
    consumptionCTProgress: 0,
    consumptionCTErrors: [],
    consumptionCTStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
    overallStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
    overallErrors: []
  }
}

export const systemChecksDefaultStateRUNNING = evolve(
  {
    pvs: {
      fwVersion: 60002
    },
    systemChecks: {
      productionCTProgress: always(10),
      productionCTStatus: always(SYSTEM_CHECKS_STATUS.RUNNING),
      consumptionCTStatus: always(SYSTEM_CHECKS_STATUS.RUNNING),
      consumptionCTErrors: always([])
    }
  },
  systemChecksDefaultState
)

export const systemChecksDefaultStateFAILED = evolve(
  {
    pvs: {
      fwVersion: 60002
    },
    systemChecks: {
      productionCTProgress: always(100),
      productionCTErrors: always([]),
      productionCTStatus: always(SYSTEM_CHECKS_STATUS.FAILED),
      consumptionCTProgress: always(100),
      consumptionCTStatus: always(SYSTEM_CHECKS_STATUS.SUCCEEDED),
      overallStatus: always(SYSTEM_CHECKS_STATUS.FAILED),
      overallErrors: always([{ error_code: '33024' }])
    }
  },
  systemChecksDefaultState
)

export const systemChecksDefaultStateSUCCEEDED = evolve(
  {
    pvs: {
      fwVersion: 60002
    },
    systemChecks: {
      productionCTProgress: always(100),
      productionCTStatus: always(SYSTEM_CHECKS_STATUS.SUCCEEDED),
      consumptionCTProgress: always(100),
      consumptionCTStatus: always(SYSTEM_CHECKS_STATUS.SUCCEEDED),
      overallStatus: always(SYSTEM_CHECKS_STATUS.SUCCEEDED)
    }
  },
  systemChecksDefaultState
)

storiesOf('SystemChecksACPV Page', module)
  .add('NOT_RUNNING', () => {
    const { store } = configureStore(systemChecksDefaultState)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <SystemChecksACPV />
        </Provider>
      </div>
    )
  })
  .add('RUNNING', () => {
    const { store } = configureStore(systemChecksDefaultStateRUNNING)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <SystemChecksACPV />
        </Provider>
      </div>
    )
  })
  .add('FAILED', () => {
    const { store } = configureStore(systemChecksDefaultStateFAILED)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <SystemChecksACPV />
        </Provider>
      </div>
    )
  })
  .add('SUCCEEDED', () => {
    const { store } = configureStore(systemChecksDefaultStateSUCCEEDED)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <SystemChecksACPV />
        </Provider>
      </div>
    )
  })
