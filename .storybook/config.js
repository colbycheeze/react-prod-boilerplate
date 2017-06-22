import React from 'react'
import { configure, storiesOf } from '@kadira/storybook'
import { FocusStyleManager } from '@blueprintjs/core'
import 'style/app.scss'

// details at http://blueprintjs.com/docs/#a11y.focus
FocusStyleManager.onlyShowFocusOnTabs()

// const allStories = require.context('../src/', true, /\.story\.js$/)
const globalComponents = require.context('components/', true, /\.story\.js$/)
const provider = require.context('routes/provider/', true, /\.story\.js$/)
const admin = require.context('routes/admin/', true, /\.story\.js$/)
const sharing = require.context('routes/sharing/', true, /\.story\.js$/)

const separator = text => storiesOf(text).add('placeholder', () => <div>placeholder</div>)

function loadStories() {
  separator('------- Global UI --------')
  globalComponents.keys().forEach(globalComponents)

  separator('------- Provider --------')
  provider.keys().forEach(provider)

  separator('------- Admin --------')
  admin.keys().forEach(admin)

  separator('------- Sharing --------')
  sharing.keys().forEach(sharing)
}

configure(loadStories, module)
