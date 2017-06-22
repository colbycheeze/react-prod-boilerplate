import React, { Component, PropTypes as PT } from 'react'
import { storiesOf, action } from '@kadira/storybook'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import modelsState from 'modules/models/models.factory'

import { Button } from 'components/core'
import Container from '../Container'
import FormManager from './FormManager'
import { Form } from './Form/Form'
import { CreateCopyDialog } from './CreateCopyDialog/CreateCopyDialog'

const initialState = modelsState('/provider/forms')
const mockStore = configureStore([reduxThunk])(initialState)
const mockApi = new MockAdapter(axios)
mockApi.onAny().reply(200, {})

export class ActionController extends Component {
  static propTypes = {
    pdfs: PT.arrayOf(PT.object),
  }

  static defaultProps = {
    pdfs: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      status: '',
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  handleSuccess = () => {
    action('Generating PDF - Success')()
    this.setState({ status: 'start' })
    this.timer = setTimeout(() => {
      this.setState({ status: 'success' })
    }, 2500)
  }

  handleError = () => {
    action('Generating PDF - Error')()
    this.setState({ status: 'start' })
    this.timer = setTimeout(() => {
      this.setState({ status: 'error' })
    }, 2500)
  }

  render = () => (
    <div>
      <Button label="Generate PDF Success" onClick={this.handleSuccess} />
      <Button label="Generate PDF Error" onClick={this.handleError} />
      <br /><br />
      <Form
        id="1"
        name="Texas Standard Credentialing Application"
        createdAt="2016-12-28T13:30:13.547Z"
        taskStatus={this.state.status}
        archiveForm={action('Archiving')} //eslint-disable-line
      />
    </div>
    )
}


storiesOf('Forms Manager', module)
.addDecorator((story) => (
  <Container>
    {story()}
  </Container>
))
.add('Form Manager', () => (
  <Provider store={mockStore}>
    <FormManager />
  </Provider>
))
.add('Generate PDF Action', () => (
  <Provider store={mockStore}>
    <ActionController />
  </Provider>
))
.add('Create Copy Dialog', () => (
  <CreateCopyDialog
    copyTemplate={action('Creating Copy')}
    templateTitle="Texas Standard Credentialing Application"
    templateId="1"
    onClose={action('Dialog Close Action')}
    isOpen
  />
))
// .add('Create PDF Dialog (none existing)', () => (
//   <CreatePDFDialog
//     templateTitle="Texas Standard Credentialing Application"
//     formId="1"
//     formTitle="Methodist Hospital"
//     pdfs={[]}
//     onClose={action('Dialog Close Action')}
//     onReplace={action('Replace PDF Action')}
//     onCreate={action('Create PDF Action')}
//     isOpen
//   />
// ))
// .add('Create PDF Dialog (pdfs exist)', () => (
//   <CreatePDFDialog
//     formId="1"
//     templateTitle="Texas Standard Credentialing Application"
//     formTitle="Methodist Hospital"
//     pdfs={[
//       {
//           id: '1',
//           name: 'Methodist Hospital PDF',
//       },
//       {
//           id: '2',
//           name: 'Methodist Hospital PDF 2',
//       },
//     ]}
//     onClose={action('Dialog Close Action')}
//     onReplace={action('Replace PDF Action')}
//     onCreate={action('Create PDF Action')}
//     isOpen
//   />
// ))
