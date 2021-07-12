import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import Home from '.'

import { configureStore } from 'state/store'

storiesOf('Home Page', module)
  .add('Simple', () => {
    const mockedStore = {
      global: {
        statusMessages: []
      }
    }
    const { store } = configureStore(mockedStore)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <Home />
        </Provider>
      </div>
    )
  })
  .add('With status messages', () => {
    const mockedStore = {
      global: {
        statusMessages: [
          {
            content:
              '<div><h1>This is some HTML header</h1><p>This is the body content of this message</p></div>'
          },
          {
            content:
              '<div><h1>This is another HTML header</h1><p>This is the 2nd body content blob</p></div>'
          }
        ]
      }
    }
    const { store } = configureStore(mockedStore)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <Home />
        </Provider>
      </div>
    )
  })
