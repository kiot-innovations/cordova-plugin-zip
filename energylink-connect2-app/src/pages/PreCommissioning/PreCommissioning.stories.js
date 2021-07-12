import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import PreCommissioning from '.'

import { configureStore } from 'state/store'

const mockedStore = {
  global: {
    showPrecommissioningChecklist: false
  }
}

storiesOf('Precommissioning Checklist', module).add('Simple', () => {
  const { store } = configureStore(mockedStore)

  return (
    <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
      <Provider store={store}>
        <PreCommissioning />
      </Provider>
    </div>
  )
})
