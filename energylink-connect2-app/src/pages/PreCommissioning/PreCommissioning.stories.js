import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import PreCommissioning from '.'

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
