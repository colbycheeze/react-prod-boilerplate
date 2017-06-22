import React from 'react'
import { storiesOf } from '@kadira/storybook'
import NotFound from './NotFound'

storiesOf('404 - Not Found page', module)
  .add('404', () => (
    <NotFound />
  ))
