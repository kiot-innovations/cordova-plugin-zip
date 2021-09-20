import deepFreeze from 'deep-freeze'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-canvas-mock'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { ActionsObservable } from 'redux-observable'
import thunk from 'redux-thunk'
import { TestScheduler } from 'rxjs/testing'

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
  dependencies,
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
  const outputAction = epic(action$, state$, { ...dependencies, ts })

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
global.mountWithProvider = children => (initialState, history) => {
  const store = mockedStore(initialState)
  return {
    component: mount(
      history ? (
        <Router history={history} keyLength={0}>
          <Provider store={store}>{children}</Provider>
        </Router>
      ) : (
        <BrowserRouter keyLength={0}>
          <Provider store={store}>{children}</Provider>
        </BrowserRouter>
      )
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
