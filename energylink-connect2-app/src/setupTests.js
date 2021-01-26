import React from 'react'
import { configure, mount } from 'enzyme'
import { Provider } from 'react-redux'
import Adapter from 'enzyme-adapter-react-16'
import deepFreeze from 'deep-freeze'
import configureStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import thunk from 'redux-thunk'
import { TestScheduler } from 'rxjs/testing'
import { ActionsObservable } from 'redux-observable'

configure({ adapter: new Adapter() })

// Use this to test reducers
global.reducerTester = reducer => (currentState, action, expectedState) => {
  if (currentState && typeof currentState === 'object') {
    deepFreeze(currentState)
  }
  const newState = reducer(currentState, action)
  return expect(newState).toEqual(expectedState)
}

const mockedStore = (initial = {}) => configureStore([thunk])(initial)

// Use this to test epics
global.epicTester = epic => (
  inputMarble,
  expectedMarble,
  inputValues,
  expectedValues,
  state,
  maxFrames
) => {
  const ts = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })

  const action$ = new ActionsObservable(
    ts.createHotObservable(inputMarble, inputValues)
  )
  const state$ = {
    value: state
  }
  const outputAction = epic(action$, state$, ts)

  ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

  if (maxFrames) {
    ts.maxFrames = maxFrames
  }

  ts.flush()
}

// Use this to add N time frames for epic tests
global.addTimeFrames = (milliseconds, value = '') =>
  `${'-'.repeat(milliseconds / 10)}${value}`

// Use this to test mounted components w/ store connection
global.mountWithProvider = children => initialState => {
  const store = mockedStore(initialState)
  return {
    component: mount(
      <Router keyLength={0}>
        <Provider store={store}>{children}</Provider>
      </Router>
    ),
    store
  }
}

// fromEntries polyfill not supported in node
Object.fromEntries = l => l.reduce((a, [k, v]) => ({ ...a, [k]: v }), {})

// nextTick Promise
global.nextTick = fn =>
  new Promise(resolve => {
    process.nextTick(() => {
      fn()
      resolve()
    })
  })

const moment = jest.requireActual('moment-timezone')
jest.doMock('moment', () => {
  moment.tz.setDefault('America/Los_Angeles')
  return moment
})

afterEach(() => {
  jest.restoreAllMocks()
})
