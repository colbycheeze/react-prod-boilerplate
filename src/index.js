/* eslint-disable global-require */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import ReactGA from 'react-ga'

import { syncRouter } from 'modules/location'
import enableAxiosInterceptors from 'store/axiosInterceptors'
import configureStore from 'store'
import './style/app.scss'

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('app')

const render = () => {
  const store = configureStore()
  const routes = require('./routes').default(store)

  enableAxiosInterceptors(store)
  syncRouter(store, routes, browserHistory)
  ReactGA.initialize(__GA_TRACKING_ID__ || 'placeholder')

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
    </Provider>, MOUNT_NODE
  )
}

if (__DEV__ && module.hot) {
  module.hot.accept('./routes', () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE)
      render()
    })
  })
}

// ========================================================
// Go!
// ========================================================
render()
/* eslint-enable */
