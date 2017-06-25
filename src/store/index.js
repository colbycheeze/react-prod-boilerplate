/* eslint-disable no-underscore-dangle */
/* eslint-disable import/newline-after-import */
/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import makeRootReducer from './rootReducer';

const enhancers = [];
const middleware = [thunk];

export default function configureStore(routes, initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    ),
  );

  store.asyncReducers = {};

  if (__DEV__ && module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer(store.asyncReducers));
    });
  }

  return store;
}
/* eslint-enable */
