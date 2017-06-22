import jwtDecode from 'jwt-decode'

import { selectUserTypeFromRoute } from 'modules/location'
import { selectUser, selectToken } from 'modules/account/account'
import { selectStatus, fetchProvider } from 'modules/provider/provider'
import ViewDocument from 'components/ViewDocument'

// import { injectReducer } from 'store/reducers';
// import { getDemoSession } from 'modules/demos';

import Container from './components/Container'
import NoResponsive from './components/NoResponsive/NoResponsive'
import AuthRoute from './routes/auth'
import DashboardRoute from './routes/dashboard'
import RegistrationRoute from './routes/registration'
import AccountRoute from './routes/account'
import CredentialsRoute from './routes/credentials'
import FormsRoute from './routes/forms'
import DocumentsRoute from './routes/Documents'

export default (store) => {
  const loadProvider = () => {
    const state = store.getState()

    if (selectUser(state)) return
    if (selectStatus(state).isFetchingProviders) return

    const userType = selectUserTypeFromRoute(state)
    const token = selectToken(state, userType, 'Auth')

    if (token) store.dispatch(fetchProvider(jwtDecode(token).id, { billing: true }))
  }

  return {
    path: 'provider',
    name: 'Provider',
    component: Container,
    indexRoute: {
      onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/dashboard/main`),
    },
    onEnter: loadProvider,
    childRoutes: [
      {
        path: 'desktop-only',
        name: 'Desktop Only',
        component: NoResponsive,
      },
      AuthRoute(store),
      DashboardRoute(store),
      RegistrationRoute(store),
      AccountRoute(store),
      CredentialsRoute(store),
      FormsRoute(store),
      DocumentsRoute(store),
      {
        path: 'documents/:documentId',
        name: 'Document',
        component: ViewDocument,
      },
    ],
  }
}
