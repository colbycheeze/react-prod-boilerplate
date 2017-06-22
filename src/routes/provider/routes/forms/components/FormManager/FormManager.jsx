import { Link } from 'react-router'
import React, { Component, PropTypes as PT } from 'react'
import FlipMove from 'react-flip-move'
import { connect } from 'react-redux'
import { values } from 'lodash'
import fuzzy from 'fuzzy'
import { selectUserTypeFromRoute } from 'modules/location'

import { TextInput } from 'components/core/forms'
import { Switch } from '@blueprintjs/core'
import {
  toggleArchived,
  toggleShowAll,
} from 'modules/models/models'
import {
  selectForms,
  selectFormTemplates,
  selectFormsState,
  selectTemplatesState,
} from 'modules/models/models.selectors'
import { LoadingOverlay, Section } from 'components/core'

import FormTemplate from './FormTemplate'
import Form from './Form'
import classes from './formManager.scss'

const mapStateToProps = (state) => {
  const forms = values(selectForms(state))
  const formTemplates = values(selectFormTemplates(state))
  const hasLoaded = !!selectTemplatesState(state).sorted.length

  return {
    hasLoaded,
    formTemplates,
    forms,
    isAdmin: selectUserTypeFromRoute(state) === 'admin',
    showArchived: selectFormsState(state).showArchived,
    showAllTemplates: selectTemplatesState(state).showAll,
  }
}

const actions = {
  toggleArchived,
  toggleShowAll,
}

export class FormManager extends Component {
  static propTypes = {
    formTemplates: PT.arrayOf(PT.shape({
      id: PT.string.isRequired,
      isGlobal: PT.bool.isRequired,
    })).isRequired,

    forms: PT.arrayOf(PT.shape({
      id: PT.string.isRequired,
      title: PT.string.isRequired,
    })).isRequired,

    // from connect
    isAdmin: PT.bool.isRequired,
    hasLoaded: PT.bool.isRequired,
    showArchived: PT.bool.isRequired,
    showAllTemplates: PT.bool.isRequired,
    toggleArchived: PT.func.isRequired,
    toggleShowAll: PT.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      filterBy: '',
    }
  }

  componentDidMount() {
    this.filterInput.focus()
  }

  handleFilterChange = event => {
    this.setState({ filterBy: event.target.value })
  }

  renderHeading = () => {
    const { isAdmin } = this.props

    if (!isAdmin) {
      return (
        <div className={classes.formsHeading}>
          <h1>Fill Forms</h1>
          <span className={classes.allForms}>
            <Link to="/provider/forms">Pending Forms</Link>
          </span>
          <span className={classes.pageDescription}>
            Your forms section is where you can find all of the forms that you have been assigned to complete.
            You can also generate PDF copies to share with credentialing entities such as hospitals, medical facilities, and insurance payers.
          </span>
          <h3>All Forms</h3>
        </div>
      )
    }
  }

  renderDefaultList = () => {
    const { formTemplates } = this.props
    const globalTemplates = formTemplates.filter(template => template.isGlobal)
    const entityTemplates = formTemplates.filter(template => !template.isGlobal)
    const globalExists = !!globalTemplates.length
    const entityExists = !!entityTemplates.length

    return (
      <div>
        {globalExists &&
          <Section label="Global Forms">
            {globalTemplates.map(template => (
              <FormTemplate
                key={template.id}
                {...template}
              />
            ))}
          </Section>
        }

        {entityExists &&
          <Section label="Entity Forms">
            {entityTemplates.map(template => (
              <FormTemplate
                key={template.id}
                {...template}
              />
            ))}
          </Section>
        }
      </div>
    )
  }

  renderFilteredList = () => {
    const { filterBy } = this.state
    const { forms, formTemplates } = this.props
    const options = {
      pre: '<b>',
      post: '</b>',
      extract: result => result.title,
    }
    const formResults = fuzzy.filter(filterBy, forms, options)
    const templateResults = fuzzy.filter(filterBy, formTemplates, options)

    return (
      <div>
        <Section label="Filtered Form Templates">
          {templateResults.map(({ original, string }) => (
            <FormTemplate
              key={original.id}
              id={original.id}
              title={original.title}
              decoratedTitle={string}
            />
          ))}
        </Section>

        <Section label="Filtered Forms">
          <FlipMove
            duration={250}
            staggerDurationBy={20}
            staggerDelayBy={20}
            enterAnimation="accordianVertical"
            leaveAnimation="accordianVertical"
          >
            {formResults.map(({ original, string }) => (
              <Form
                key={original.id}
                id={original.id}
                decoratedTitle={string}
                isFilteredResult
              />
            ))}
          </FlipMove>
        </Section>
      </div>
    )
  }

  render = () => (
    <div className={classes.wrapper}>

      {this.renderHeading()}

      <div className={classes.filter}>
        <TextInput
          label="Filter Forms and Templates"
          inputRef={element => { this.filterInput = element }}
          leftIconName="filter"
          value={this.state.filterBy}
          onChange={this.handleFilterChange}
          placeholder="Filter forms and templates..."
          type="search"
        />

        <Switch
          label="Show archived"
          checked={this.props.showArchived}
          onChange={this.props.toggleArchived} // eslint-disable-line react/jsx-handler-names
        />

        <Switch
          label="Show all form templates"
          checked={this.props.showAllTemplates}
          onChange={this.props.toggleShowAll} // eslint-disable-line react/jsx-handler-names
        />
      </div>

      {!this.props.hasLoaded && <LoadingOverlay inline title="Loading Form Data..." />}

      {this.state.filterBy.length ?
        this.renderFilteredList()
        :
        this.renderDefaultList()
      }
    </div>
    )
}

export default connect(mapStateToProps, actions)(FormManager)
