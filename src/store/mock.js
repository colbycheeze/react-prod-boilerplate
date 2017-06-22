// This file was extracted from the `redux-mock-store` plugin (https://github.com/arnaudbenard/redux-mock-store)
// We are extending the functionality from this plugin with reducer processing.
// The reason we are doing this is because, although in general when we test thunks
//   we care (and should only care) about what actions are dispatched,
//   sometimes we also want to know that the data was manipulated in the expected way.
//   In order to properly test this, we need to be able to not only see what actions are dispatched
//   but also let the reducers process those actions and manipulate the store state

import { applyMiddleware } from 'redux'

const isFunction = arg => typeof arg === 'function'

export default function configureStore(middlewares = []) {
  return function mockStore(getState = {}, initialReducer) {
    function mockStoreWithoutMiddleware() {
      let state = isFunction(getState) ? getState() : getState
      let actions = []
      let reducer = initialReducer
      const listeners = []

      return {
        getState() {
          return isFunction(state) ? state() : state
        },

        getActions() {
          return actions
        },

        dispatch(action) {
          if (typeof action === 'undefined') {
            throw new Error(
              'Actions may not be an undefined.'
            )
          }

          if (typeof action.type === 'undefined') {
            throw new Error(
              `${'Actions may not have an undefined "type" property. ' +
              'Have you misspelled a constant? ' +
              'Action: '}${
              JSON.stringify(action)}`
            )
          }

          if (reducer) state = reducer(state, action)
          actions.push(action)

          for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
          }

          return action
        },

        clearActions() {
          actions = []
        },

        subscribe(cb) {
          if (isFunction(cb)) {
            listeners.push(cb)
          }

          return () => {
            const index = listeners.indexOf(cb)

            if (index < 0) {
              return
            }
            listeners.splice(index, 1)
          }
        },

        replaceReducer(nextReducer) {
          if (!isFunction(nextReducer)) {
            throw new Error('Expected the nextReducer to be a function.')
          }

          reducer = nextReducer
        },
      }
    }

    const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
    )(mockStoreWithoutMiddleware)

    return mockStoreWithMiddleware()
  }
}
