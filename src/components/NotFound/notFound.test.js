import React from 'react'
import NotFound from './NotFound'

describe('<NotFound />', () => {
  it('renders', () => {
    const wrapper = render(<NotFound />)

    expect(wrapper).toMatchSnapshot()
  })
})
