/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import configureStore from 'store';
import Routes from './routes';

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  const store = configureStore();
  // const routes = require('./routes').default(store)

  // enableAxiosInterceptors(store)
  // syncRouter(store, routes, browserHistory)

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/something">Something</Link></li>
          </ul>

          <hr />

          <Routes />

        </div>
      </Router>
    </Provider>
    , MOUNT_NODE
  );
};

if (__DEV__ && module.hot) {
  module.hot.accept('./routes', () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render();
    });
  });
}

// ========================================================
// Go!
// ========================================================
render();
/* eslint-enable */
