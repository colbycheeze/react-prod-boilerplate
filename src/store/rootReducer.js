import { combineReducers } from 'redux';

import something, { SOMETHING_KEY } from 'routes/something/modules/something';

const makeRootReducer = asyncReducers => combineReducers({
  ...asyncReducers,
  [SOMETHING_KEY]: something,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  // eslint-disable-next-line no-param-reassign
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
