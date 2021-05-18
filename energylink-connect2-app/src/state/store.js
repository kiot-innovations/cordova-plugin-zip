import { applyMiddleware, compose, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import rootEpic from './epics'

const epicMiddleware = createEpicMiddleware()

export function configureStore(initialState) {
  const middlewares = []

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  middlewares.push(thunk)
  middlewares.push(epicMiddleware)

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.REACT_APP_ENABLE_LOGGER
  ) {
    const { createLogger } = require('redux-logger')
    const logger = createLogger({
      predicate: (getState, action) => action.type !== 'DEVICE_IS_CONNECTED',
      collapsed: (getState, action, logEntry) => !logEntry.error
    })
    middlewares.push(logger)
  }

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.REACT_APP_ENABLE_LOGGER
  ) {
    window.store = store
  }

  epicMiddleware.run(rootEpic)

  const persistor = persistStore(store)
  return { store, persistor }
}
