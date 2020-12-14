import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'
import InstallSuccess from '.'

const initialState = {
  pvs: {
    serialNumber: 'ZT123098120398'
  }
}

storiesOf('Install Success', module).add('With PVS', () => {
  const { store } = configureStore(initialState)
  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <InstallSuccess />
      </Provider>
    </div>
  )
})
