import React, { PureComponent, PropTypes as PT } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { FocusStyleManager } from '@blueprintjs/core'

// details at http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs()

class App extends PureComponent {
  static propTypes = {
    children: PT.element.isRequired,
  }
  render() {
    return (
      <div id="app-wrapper">
        {this.props.children}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
