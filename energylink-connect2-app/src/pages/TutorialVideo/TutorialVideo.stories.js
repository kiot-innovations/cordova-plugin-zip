import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import TutorialVideo from '.'

import { configureStore } from 'state/store'

const state = {
  knowledgeBase: {
    currentTutorial: {
      title: 'Downloading firmware',
      video: 'https://vimeo.com/586055338'
    }
  }
}

storiesOf('TutorialVideo Page', module).add('Main', () => {
  const { store } = configureStore(state)
  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <TutorialVideo />
      </Provider>
    </div>
  )
})
