import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'
import NearbyPVS from '.'

const initialState = {
  network: {
    bleSearching: false,
    nearbyDevices: [
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' },
      { name: 'ZT0213423569034' }
    ],
    bluetoothStatus: '',
    err: '',
    connected: false
  }
}

storiesOf('Nearby PVS', module).add('With Storage', () => {
  const { store } = configureStore(initialState)
  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <NearbyPVS />
      </Provider>
    </div>
  )
})
