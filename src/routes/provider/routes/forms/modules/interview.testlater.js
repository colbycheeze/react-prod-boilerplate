// Disabling for now until I can uncomment and use setup boilerplate
/* eslint-disable no-unused-vars */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import mockApi, { getMockAxios } from 'api/factories/api.factory';
import mockState from './interview.factory';
import interviewReducer, {
  INTERVIEW_KEY,

  openAttestationDialog,
  OPEN_ATTESTATION_DIALOG,

  closeAttestationDialog,
  CLOSE_ATTESTATION_DIALOG,
} from './interview';

const setup = (initialState) => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const defaultInitialState = { [INTERVIEW_KEY]: mockState() };
  const store = mockStore(initialState || defaultInitialState);

  return { store };
};

describe('Interview', () => {
  it('will do something', () => {
    expect(true).toBeFalsy();
  });
  describe('Reducer', () => {
    it('initial state', () => {
      const action = '@@@@';
      const reducer = interviewReducer(undefined, action);

      expect(reducer).toEqual({
        currentSection: 0,
        isAttestDialogOpen: false,
        isCreatingPdf: false,
        hasAttested: false,
        hasAgreedToSign: false,
        generateFromListingRequest: false,
        status: {
          errors: [],
        },
      });
    });

    it('returns previous state if no type matches', () => {
      const action = '@@@@';
      const reducer = interviewReducer({}, action);

      expect(reducer).toEqual({});
    });
  });

  describe('Actions', () => {
    describe('openAttestationDialog()', () => {
      it('action', () => {
        const action = openAttestationDialog();

        expect(action).toEqual({
          type: OPEN_ATTESTATION_DIALOG,
        });
      });

      it('handler - opening dialog resets attestation responses', () => {
        const action = openAttestationDialog();
        const stateBefore = {
          generateFromListingRequest: true,
          isAttestDialogOpen: false,
          hasAgreedToSign: true,
          hasAttested: true,
        };
        const stateAfter = {
          generateFromListingRequest: false,
          isAttestDialogOpen: true,
          hasAgreedToSign: false,
          hasAttested: false,
        };

        const reducer = interviewReducer(stateBefore, action);
        expect(reducer).toEqual(stateAfter);
      });
    });

    describe('closeDialog()', () => {
      it('action', () => {
        const action = closeAttestationDialog();

        expect(action).toEqual({
          type: CLOSE_ATTESTATION_DIALOG,
        });
      });

      it('handler', () => {
        const action = closeAttestationDialog();
        const stateBefore = {
          isAttestDialogOpen: true,
        };
        const stateAfter = {
          isAttestDialogOpen: false,
        };

        const reducer = interviewReducer(stateBefore, action);
        expect(reducer).toEqual(stateAfter);
      });
    });
  });

  // describe('Thunks', () => {
  //   describe('attest()', () => {
  //     it('calls attest endpoint and changes route - 200 response', async () => {
  //       const { store } = setup()
  //       const formId = '1'
  //       const providerId = '1'
  //       const mockAxios = getMockAxios(store)
  //       const response = mockApi.forms.get({ mockAxios, formId, providerId })
  //       const expectedActions = [
  //         fetchFormsStart({ formId }),
  //         fetchDocumentsStart(),
  //         fetchFormsSuccess([response.data]),
  //       ]
  //
  //       await store.dispatch(fetchForm({ formId, providerId }))
  //       expect(store.getActions()).toEqual(expectedActions)
  //     })
  //
  //     it('error response', async () => {
  //       const { store } = setup()
  //       const formId = '1'
  //       const providerId = '1'
  //       const mockAxios = getMockAxios(store)
  //       const response = mockApi.forms.get({ mockAxios, formId, providerId, code: 404 })
  //       const expectedActions = [
  //         fetchFormsStart({ formId }),
  //         fetchDocumentsStart(),
  //         fetchFormsError(response.errors),
  //       ]
  //
  //       await store.dispatch(fetchForm({ formId, providerId }))
  //       expect(store.getActions()).toMatchObject(expectedActions)
  //     })
  //   })
  // })
});
