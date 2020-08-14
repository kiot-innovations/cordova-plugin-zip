import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'
import PanelLayoutToolSavingStatus from './PanelLayoutToolSavingStatus'

storiesOf('PanelLayoutToolSavingStatus Widget', module)
  .add('Success', () => {
    const { store } = configureStore({
      pltWizard: {
        saving: false,
        saved: true,
        error: false
      }
    })

    return (
      <div className="saving-configuration">
        <Provider store={store}>
          <PanelLayoutToolSavingStatus />
        </Provider>
      </div>
    )
  })
  .add('Saving', () => {
    const { store } = configureStore({
      pltWizard: {
        saving: true,
        saved: false,
        error: false
      }
    })

    return (
      <div className="saving-configuration">
        <Provider store={store}>
          <PanelLayoutToolSavingStatus />
        </Provider>
      </div>
    )
  })
  .add('Error', () => {
    const { store } = configureStore({
      pltWizard: {
        saving: false,
        saved: true,
        error: true
      }
    })

    return (
      <div className="saving-configuration">
        <Provider store={store}>
          <PanelLayoutToolSavingStatus />
        </Provider>
      </div>
    )
  })
