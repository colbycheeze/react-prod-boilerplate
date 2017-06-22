/* eslint-disable no-underscore-dangle */
/* eslint-disable import/newline-after-import */
/* eslint-disable global-require */
import { merge } from 'lodash'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'

import { ACCOUNT_KEY } from 'modules/account/account'
import makeRootReducer from './rootReducer'

/*
  default key of 'redux' is used to save to localStorage
  https://github.com/elgerlambert/redux-localstorage

  Also, when adding pieces of the state to persist...do NOT
  store the status object, since that could cause issues when
  a user reloads the page (such as coming back to existing errors or loading states)
*/
const savedPaths = [ACCOUNT_KEY]
const slicer = paths => {
  const defaultInitialState = makeRootReducer()(undefined, {})

  return state => {
    const subset = {}

    paths.forEach(key => {
      const defaultSlice = defaultInitialState[key]
      const slice = merge({}, defaultSlice, state[key])
      if (slice) {
        if (slice.status) slice.status = defaultSlice.status
        subset[key] = slice
      }
    })

    return subset
  }
}
const enhancers = [persistState(savedPaths, { slicer })]
const middleware = [thunk]

export default function configureStore(routes, initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    ),
  )

  store.asyncReducers = {}

  if (__DEV__ && module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default
      store.replaceReducer(nextRootReducer(store.asyncReducers))
    })
  }

  return store
}
/* eslint-enable */
