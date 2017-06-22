import React, { PureComponent, PropTypes as PT } from 'react'

import classes from './Container.scss'

export default class Container extends PureComponent {
  static propTypes = { children: PT.element.isRequired }

  render = () => (
    <div className={classes.wrapper}>
      <main className={classes.content}>
        {this.props.children}
      </main>
    </div>
  )
}
