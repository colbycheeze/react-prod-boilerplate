todo: CircleCI badge
todo: Codecov badge

# WIP Production React Boilderplate

## Development
### Installation
```bash
yarn
```
We recommend installing the [Redux DevTools extension](http://zalmoxisus.github.io/redux-devtools-extension/)
### Running the app locally
and then:
```bash
yarn start
```
[http://localhost:8080](http://localhost:8080) to view web app.

#### Specify api url override in cli options
By default, you will need to have the core rails server running, however
if you want to run your local code against the staging or prod api you can!
By default it is `http://localhost:3000` but if you want to change it use:
```
yarn start:staging
or
yarn start -- --env.apiUrl=https://my.custom.api.url
```

Source maps are generated in `eval` mode which has slightly "off" line numbers, but if you need
accurate maps for debugging (at the cost of slower rebuilds and breaking Hot Module Reload) you
may use:
```bash
yarn start -- --env.debug
```

### Storybook
We use Storybook to build functionality in isolation from the app, as well as documenting components.

```bash
yarn storybook
```
[http://localhost:9001](http://localhost:9001) to view stories.

#### Test prod builds locally
```bash
yarn build && yarn serve // api defaults to http://localhost:3000
// or
yarn start:staging // api will default to https://staging.api.someurl.com
// or you can manually pass the API url
yarn build -- --env.apiUrl=https://staging.api.someurl.com
```
visit http://localhost:8081 to view prod site

### Unit Testing
The project uses [Jest](https://facebook.github.io/jest/docs/api.html), with [Enzyme](http://airbnb.io/enzyme/docs/api/) for component testing

You can view example tests in `config/jest.test.js`

Run tests in watch mode:
```bash
yarn test:watch
```

### Recommended editor setup
This project uses editorconfig and eslint to help ensure code quality.
Be sure to have a plugin for these installed.

#### Atom plugins
```bash
apm install editorconfig
apm install language-babel
apm install linter
apm install linter-eslint
```

~**Colby**: I'm maintaining several [custom atom snippets](https://github.com/colbycheeze/dotfiles/blob/dd218ff66271e071232d5f08f4c3ea15e005b2f3/atom/snippets.cson)

### Best practices

#### Using Redux Connect
Many examples show connect methods **below** a class, but that hinders visibility. Place the
`mapStateToProps` and `actions` object **above** the class declaration, and connect them below.
```js
const mapStateToProps = (state) => ({
	awesomePeople: values(selectAwesomePeople(state)),
	isLoading: selectAwesome(state).isLoading,
})
const actions = {
	toggleSomething,
	fetchAwesomeData,
}
class MyAwesomeComponent extends PureComponent {
 ...
}

connect(mapStateToProps, actions)(MyAwesomeComponent)



export default connect(mapStateToProps, actions)(FormManager)
```
#### Prop type checking
Proper use of prop types can help tremendously when trying to understand components in addition
to adding great error checking in the console while developing.
ESLint is set up to warn on missing validations. Please use the official docs as reference if you
are unsure on how to validate certain props.
[Proptype validation reference](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)
Prop types are validated in static objects IE:
```javascript
import React, { PureComponent, PropTypes as PT } from 'react'

class ComponentName extends PureComponent {
  static propTypes = {
    someProp: PT.string.isRequired,
    nonRequiredProp: PT.number,
  }

  static defaultProps = {
    nonRequiredProp: 1,
  }
}
```
