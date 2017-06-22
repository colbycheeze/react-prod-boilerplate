import { selectUserTypeFromRoute } from 'modules/location'
import { selectToken } from 'modules/account/account'
import App from 'components/App'
import NotFound from 'components/NotFound'
import ProviderRoute from './provider'
import AdminRoute from './admin'
import AdminAuthRoute from './admin/routes/auth'
import SharingRoute from './sharing'

export const requireAuth = (store, nextState, replace) => {
  const state = store.getState()
  const userType = selectUserTypeFromRoute(state)
  const token = selectToken(state, userType, 'Auth')

  if (!token) {
    replace({
      pathname: `/${userType}/auth/sign-in`,
      state: { nextPathname: nextState.location.pathname },
    })

    return true
  }

  return false
}

/*
  This is done to keep consistency with route changes that take the existing
  pathname, and add something to the end...for example:
  from: '/admin/forms/19'
  to: '/admin/forms/19/sections/101'
  if the route was actually '/admin/forms/19/' then you would end up with
  '/admin/forms/19//sections/101'
  Therefore we remove the slash on every route, and then when we concat
  additional pathname info, we can safely assume it will work.
*/
function removeTrailingSlash(nextState, replace) {
  const path = nextState.location.pathname
  if (path.length > 1 && path.slice(-1) === '/') {
    replace({
      ...nextState.location,
      pathname: `${path.slice(0, -1)}`,
    })
  }
}

function removeTrailingSlashOnChange(prevState, nextState, replace) {
  removeTrailingSlash(nextState, replace)
}
export default (store) => ({
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/provider') },
  onEnter: removeTrailingSlash,
  onChange: removeTrailingSlashOnChange,
  name: 'App',
  component: App,
  childRoutes: [
    ProviderRoute(store),
    AdminRoute(store),
    AdminAuthRoute(store),
    SharingRoute(store),
    {
      path: '*',
      name: 'Not Found',
      component: NotFound,
    },
  ],
})
