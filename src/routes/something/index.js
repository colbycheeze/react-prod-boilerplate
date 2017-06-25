import React, { Component } from 'react';
import Something from './components/Something';

export default class SomethingRoute extends Component {
  componentWillMount() {
    console.log('Loading Data...');
  }

  render = () => (
    <Something />
  )
}
