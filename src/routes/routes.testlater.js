import React from 'react';
import { Router, createMemoryHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import modelsState from 'modules/models/models.factory.js';

import getRoutes from './index';

const setup = (pathname = '/', { params } = {}) => {
  const initialState = modelsState(pathname, { locationOptions: { params } });
  const mockStore = configureStore([reduxThunk])(initialState);

  const props = {
    routes: getRoutes(mockStore),
    history: createMemoryHistory(pathname),
  };

  return { props, mockStore };
};

describe('routes', () => {
  it('renders 404 page if no route matches', () => {
    const { props } = setup('/nonexistant-route');
    const wrapper = render(<Router {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
