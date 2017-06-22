import { LOCATION_KEY } from './location'

export default (pathname = '/', { query, params, action = 'PUSH' } = {}) => ({
  [LOCATION_KEY]: {
    pathname,
    search: '',
    hash: '',
    state: null,
    action,
    key: 'xovkkh',
    query: { ...query },
    params: { ...params },
  },
})
