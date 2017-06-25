import React from 'react';
import { Something } from './Something';

const setup = () => {
  const spies = {
    doSomething: jest.fn(),
  };

  const props = {
    thing: 'Test Thing',
    ...spies,
  };

  return { spies, props };
};

describe('<Something />', () => {
  it('Shows a default thing on load', () => {
    const { props } = setup();
    const wrapper = shallow(<Something {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('Does something when the button is clicked', () => {
    const { props, spies } = setup();
    const wrapper = shallow(<Something {...props} />);

    expect(spies.doSomething).not.toBeCalled();
    wrapper.find('button').simulate('click');
    expect(spies.doSomething).toBeCalled();
  });
});
