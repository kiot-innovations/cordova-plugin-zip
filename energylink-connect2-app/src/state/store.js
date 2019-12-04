import { createStore, compose, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistStore } from 'redux-persist'
import rootReducer from './reducers'
import rootEpic from './epics'

const epicMiddleware = createEpicMiddleware()

export function configureStore(initialState) {
  const middlewares = []

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  // middlewares.push(applyMiddleware(thunk))
  middlewares.push(applyMiddleware(epicMiddleware))

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(...middlewares)
  )

  epicMiddleware.run(rootEpic)

  const persistor = persistStore(store)
  return { store, persistor }
}
