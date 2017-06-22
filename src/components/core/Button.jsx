import React, { PureComponent, PropTypes as PT } from 'react'
import { Button as BlueprintButton, Intent } from '@blueprintjs/core'
import classNames from 'classnames'

export default class Button extends PureComponent {
  static propTypes = {
    className: PT.string,
    children: PT.oneOfType([PT.element, PT.array]),
    label: PT.oneOfType([PT.string, PT.element]),
    loading: PT.bool,

    // Types
    large: PT.bool,
    active: PT.bool,
    minimal: PT.bool,

    // Intents
    primary: PT.bool,
    danger: PT.bool,
    success: PT.bool,
    warning: PT.bool,
  }

  static defaultProps = {
    className: '',
    children: null,
    label: null,
    loading: false,

    large: false,
    active: false,
    minimal: false,

    primary: false,
    danger: false,
    success: false,
    warning: false,
  }

  render = () => {
    const {
      className,
      children,
      label,

      large,
      active,
      minimal,

      primary,
      success,
      warning,
      danger,

      ...rest
    } = this.props

    let intent
    intent = primary ? Intent.PRIMARY : Intent.NONE
    intent = success ? Intent.SUCCESS : intent
    intent = warning ? Intent.WARNING : intent
    intent = danger ? Intent.DANGER : intent

    const finalClassName = classNames(
      {
        'pt-large': large,
        'pt-active': active,
        'pt-minimal': minimal,
      },
      className
    )

    return (
      <BlueprintButton
        intent={intent}
        className={finalClassName}
        {...rest}
      >
        {!this.props.loading && (children || label)}
      </BlueprintButton>
    )
  }
}
