import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import navReducer, { NAV_KEY } from 'modules/nav/nav'
import locationReducer, { LOCATION_KEY } from 'modules/location'
import accountReducer, { ACCOUNT_KEY } from 'modules/account/account'
import modelsReducer, { MODELS_KEY } from 'modules/models/models'

import sharedFoldersCoreReducer, { MODULE_NAME as sharedFoldersCoreKey } from 'modules/sharing'
import {
  CoreReducers,
  PROVIDER_MODULE_NAME,
  VAULT_MODULE_NAME,
  DOCUMENT_MODULE_NAME,
  FORM_MODULE_NAME,
} from 'deprecated/core-actions'

const makeRootReducer = asyncReducers => combineReducers({
  ...asyncReducers,

  [NAV_KEY]: navReducer,
  [LOCATION_KEY]: locationReducer,
  [ACCOUNT_KEY]: accountReducer,
  [MODELS_KEY]: modelsReducer,

  [PROVIDER_MODULE_NAME]: CoreReducers.provider,
  [VAULT_MODULE_NAME]: CoreReducers.vault,
  [DOCUMENT_MODULE_NAME]: CoreReducers.document,
  [FORM_MODULE_NAME]: CoreReducers.form,
  [sharedFoldersCoreKey]: sharedFoldersCoreReducer,
  form: formReducer,
})

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  // eslint-disable-next-line no-param-reassign
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
