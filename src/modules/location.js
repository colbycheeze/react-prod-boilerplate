import { createRoutes } from 'react-router'
import matchRoutes from 'react-router/lib/matchRoutes'
import ReactGA from 'react-ga'
import jwtDecode from 'jwt-decode'

import { selectToken } from 'modules/account/account'

export const LOCATION_KEY = 'nextLocation'

// ------------------------------------
// Selectors
// ------------------------------------
export const selectLocation = state => state[LOCATION_KEY]
export const selectParams = state => selectLocation(state).params
export const selectUserTypeFromRoute = state => {
  const adminTest = /^.*(\/admin)/
  const groupTest = /^.*(\/group)/
  const providerTest = /^.*(\/provider)/
  const sharingTest = /^.*(\/sharing)/
  const path = selectLocation(state).pathname

  if (adminTest.test(path)) return 'admin'
  if (groupTest.test(path)) return 'groups'
  if (providerTest.test(path) || path === '/') return 'provider'
  if (sharingTest.test(path)) return 'sharing'

  throw new Error(`Could not determine the user type based on the pathname: ${path}.`)
}

export const selectProviderId = (state, { providerId }) => {
  if (providerId) return providerId

  const locationType = selectUserTypeFromRoute(state)

  if (locationType !== 'provider') return selectParams(state).providerId
  return jwtDecode(selectToken(state, 'provider', 'Auth')).id
}

// ------------------------------------
// Reducer
// ------------------------------------
const actionHandlers = {}
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'
export const locationChange = (location = '/', params) => ({
  type: LOCATION_CHANGE,
  payload: { location, params },
})
actionHandlers[LOCATION_CHANGE] = (state, { location, params }) => ({
  ...location,
  params,
})

const initialState = {
  params: {},
}
export default function locationReducer(state = initialState, { type, payload }) {
  const handler = actionHandlers[type]

  return handler ? handler(state, payload) : state
}

// Helper used in app setup to keep redux state in sync with path changes
export function syncRouter(store, routes, history) {
  const routesArray = createRoutes(routes)

  return history.listen(location => {
    matchRoutes(routesArray, location, (error, state) => {
      if (!error) {
        if (__PROD__) {
          // for now, only tracking provider route
          const providerTest = /^.*(\/provider)/
          const path = location.pathname

          // eslint-disable-next-line no-underscore-dangle
          if (location.query._ga) {
            // since the client ID can only be set on initialization
            // we need to do re-initialize ReactGA here with the proper client ID
            // the client ID is set under the _ga query parameter for cross domain tracking
            ReactGA.initialize(__GA_TRACKING_ID__, {
              gaOptions: {
                // eslint-disable-next-line no-underscore-dangle
                clientId: location.query._ga,
              },
            })
          }

          if (providerTest.test(path) || path === '/') { ReactGA.pageview(path) }
        }

        store.dispatch(locationChange(location, state ? state.params : {}))
      }
    })
  })
}
