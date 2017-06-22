import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { get, merge } from 'lodash'

import { selectUserTypeFromRoute, selectParams } from 'modules/location'
import { signOut, selectToken } from 'modules/account/account'

const providerIdFromToken = state => {
  if (selectUserTypeFromRoute(state) !== 'provider') {
    throw new Error('User Type is not provider, but providerId is missing from API call!')
  } else {
    return jwtDecode(selectToken(state, 'provider', 'Auth')).id
  }
}

const replaceUrl = (url, template, replacement) => {
  if (!replacement) {
    throw new Error(
      `No replacement exists for ${template}. Check the params being passed in to your API call.`
    )
  }

  return url.replace(template, replacement)
}

const replaceTemplateStrings = (apiUrl, state) => {
  const urlParams = selectParams(state)
  const providerId = /{{providerId}}/
  const formId = /{{formId}}/
  const templateId = /{{templateId}}/
  let newUrl = apiUrl

  if (providerId.test(apiUrl) && urlParams.providerId) {
    newUrl = replaceUrl(newUrl, providerId, urlParams.providerId)
  }
  if (providerId.test(newUrl)) newUrl = replaceUrl(newUrl, providerId, providerIdFromToken(state))
  if (formId.test(newUrl)) newUrl = replaceUrl(newUrl, formId, urlParams.formId)
  if (templateId.test(newUrl)) newUrl = replaceUrl(newUrl, templateId, urlParams.templateId)

  return newUrl
}

/*
  device token is used for header in the auth api calls
  - /providers/auth/login
  - /admin/auth/login
  - /verification/phone_number
  - /verification/request_code
  - /verification/device
*/
const deviceTokenRequired = apiUrl =>
  /^.*(\/providers\/auth\/login|\/admin\/auth\/login|\/verification\/phone_number|\/verification\/request_code|\/verification\/device)/
    .test(apiUrl)

const interceptRequests = store => {
  axios.defaults.baseURL = `${__API_ROOT__}/`

  axios.interceptors.request.use(
    config => {
      const state = store.getState()
      const url = replaceTemplateStrings(config.url, state)
      const userType = selectUserTypeFromRoute(state)

      if (deviceTokenRequired(url)) {
        return merge({}, config, {
          url,
          headers: merge({}, config.headers, {
            DeviceToken: selectToken(state, userType, 'Device'),
          }),
        })
      }

      return merge({}, config, {
        url,
        headers: merge({}, config.headers, {
          Authorization: `Bearer ${selectToken(state, userType, 'Auth')}`,
        }),
      })
    },

    error => {
      if (__DEV__) console.log('API Request Error: --------------------- v')
      return Promise.reject(error)
    }
  )
}

const interceptResponses = store => {
  axios.interceptors.response.use(
    response => response,

    error => {
      const is419 = /419/.test(error.toString())
      const errors = get(error, 'data.errors', []) || get(error, 'response.data.errors', [])
      const isTokenError = errors.find(err => /^(token_expired|invalid_token)$/.test(err.code))

      if (is419 || isTokenError) {
        const userType = selectUserTypeFromRoute(store.getState())

        if (userType !== 'sharing') {
          // in the sharing namespace, we don't have a sign-in
          // since access is only permitted through a designated link
          store.dispatch(signOut(userType))
        }
      } else if (__DEV__ && !/417/.test(error.toString())) {
        console.log('API Response Error: --------------------- v')
        console.error(error)
      }

      return Promise.reject(error.response || error)
    }
  )
}

const enableAxiosInterceptors = store => {
  interceptResponses(store)
  interceptRequests(store)
}

export default enableAxiosInterceptors
