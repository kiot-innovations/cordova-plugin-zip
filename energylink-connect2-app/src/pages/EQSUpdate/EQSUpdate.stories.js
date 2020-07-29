import React from 'react'
import { storiesOf } from '@storybook/react'
import EQSUpdate from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

storiesOf('Storage - FW Update', module).add('Simple', () => {
  const { store } = configureStore({
    storage: { deviceUpdate: { firmware_update_status: '' }, error: '' }
  })
  return (
    <div className="full-min-height">
      <Provider store={store}>
        <EQSUpdate />
      </Provider>
    </div>
  )
})
