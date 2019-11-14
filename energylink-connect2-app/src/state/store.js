import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

export function configureStore(initialState) {
  const middlewares = []

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  middlewares.push(applyMiddleware(thunk))

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(...middlewares)
  )

  const persistor = persistStore(store)
  return { store, persistor }
}
