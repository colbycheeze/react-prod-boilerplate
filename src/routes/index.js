import React, { Component } from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import HomeRoute from 'components/App';
import NotFoundRoute from 'components/NotFound';
import SomethingRoute from 'routes/something';


export default class Routes extends Component {
  render = () => (
    <Switch>
      <Route exact path="/" component={HomeRoute} />
      <Route path="/something" component={SomethingRoute} />

      <Route component={NotFoundRoute} />
    </Switch>
    )
}
