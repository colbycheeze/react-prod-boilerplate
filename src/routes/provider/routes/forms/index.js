import { requireAuth } from 'routes'
import { fetchEverything, fetchForm } from 'modules/models/models'
import { injectReducer } from 'store/rootReducer'
import Container from './components/Container'
import FormManager from './components/FormManager'
import FormAttention from './components/FormManager/FormAttention'
import Interview from './components/Interview'
import interviewReducer, { INTERVIEW_KEY } from './modules/interview'

export default (store) => ({
  path: 'forms',
  name: 'Forms',
  component: Container,
  onEnter: (nextState, replace) => {
    requireAuth(store, nextState, replace)
  },
  indexRoute: {
    component: FormAttention,
    onEnter: () => { store.dispatch(fetchEverything({ includes: [] })) },
  },
  childRoutes: [
    {
      path: 'all',
      name: 'Form Manager',
      component: FormManager,
      onEnter: () => { store.dispatch(fetchEverything({ includes: [] })) },
    },
    {
      path: ':formId',
      name: 'Form Interview',
      component: Interview,
      onEnter: (nextState) => {
        injectReducer(store, {
          key: INTERVIEW_KEY,
          reducer: interviewReducer,
        })

        const formId = nextState.params.formId

        store.dispatch(fetchForm({ formId, include: ['template', 'documents'] }))
      },
    },
  ],
})
