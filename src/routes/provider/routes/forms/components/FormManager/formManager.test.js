import React from 'react'
import { values } from 'lodash'
import { formsData, formTemplates } from 'modules/models/models.factory.js'
import { FormManager } from './FormManager'

const setup = () => {
  const spies = {
    toggleArchived: jest.fn(),
    toggleShowAll: jest.fn(),
  }

  const props = {
    formTemplates: values(formTemplates()),
    forms: values(formsData()).slice(0, -1), // don't pass in the form belonging to provider '2'
    showArchived: false,
    showAllTemplates: false,
    toggleArchived: spies.toggleArchived,
    toggleShowAll: spies.toggleShowAll,
    hasLoaded: true,
    isAdmin: false,
  }

  return { spies, props }
}

describe('<FormManager />', () => {
  it('Shows loader when data is fetching', () => {
    const { props } = setup()
    props.forms = []
    props.formTemplates = []
    props.hasLoaded = false
    const wrapper = shallow(<FormManager {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders non archived forms', () => {
    const { props } = setup()
    const wrapper = shallow(<FormManager {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('archived switch is flipped when showArchived is true', () => {
    const { props } = setup()
    props.showArchived = true

    const wrapper = shallow(<FormManager {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders filtered list', () => {
    const { props } = setup()

    const wrapper = shallow(<FormManager {...props} />)
    const filterInput = wrapper.find({ type: 'search' })
    filterInput.simulate('change', { target: { value: 'te' } })

    expect(wrapper).toMatchSnapshot()
  })

  it('calls toggleArchived when switch is clicked', () => {
    const { props, spies } = setup()
    const wrapper = shallow(<FormManager {...props} />)

    expect(spies.toggleArchived).not.toBeCalled()
    wrapper.find({ label: 'Show archived' }).simulate('change')
    expect(spies.toggleArchived).toBeCalled()
  })

  it('calls toggleShowAll when switch is clicked', () => {
    const { props, spies } = setup()
    const wrapper = shallow(<FormManager {...props} />)

    expect(spies.toggleShowAll).not.toBeCalled()
    wrapper.find({ label: 'Show all form templates' }).simulate('change')
    expect(spies.toggleShowAll).toBeCalled()
  })
})
