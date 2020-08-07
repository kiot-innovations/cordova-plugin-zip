import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import SavingConfiguration from './index'

storiesOf('Saving Configuration Page', module)
  .add('Successful Configuration', () => {
    const { store } = configureStore({
      systemConfiguration: {
        submit: {
          commissioned: true,
          error: ''
        }
      },
      pvs: {
        serialNumber: 'ZT190885000549A1374'
      }
    })

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <SavingConfiguration />
        </Provider>
      </div>
    )
  })
  .add('Unsuccessful Configuration', () => {
    const { store } = configureStore({
      systemConfiguration: {
        submit: {
          commissioned: false,
          error: 'Something wrong happened.'
        }
      }
    })

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <SavingConfiguration />
        </Provider>
      </div>
    )
  })
