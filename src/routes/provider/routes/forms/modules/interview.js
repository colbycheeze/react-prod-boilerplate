import { Intent } from '@blueprintjs/core'

import api from 'api'
import { AppToaster } from 'components/core'
import { fetchFormsSuccess } from 'modules/models/models'

export const INTERVIEW_KEY = 'interview'

// ------------------------------------
// Selectors
// ------------------------------------
export const selectInterviewState = state => state[INTERVIEW_KEY]
export const selectStatus = state => selectInterviewState(state).status

// ------------------------------------
// Reducer
// ------------------------------------
const actions = {}
const initialState = {
  currentSection: 0,
  isAttestDialogOpen: false,
  isCreatingPdf: false,
  hasAttested: false,
  hasAgreedToSign: false,

  // this attribute is used when clicking the `create PDF` from the forms listing page
  // since for now we are redirecting to the interview page to display the attest/create PDF modal
  // we don't know what modal to display until the form data is loaded
  // so this flag is used to let the Interview component know when it mounts
  // that the attest/create PDF modal needs to be displayed
  generateFromListingRequest: false,

  status: {
    errors: [],
  },
}
export const reducer = (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state
}
export default reducer

// ------------------------------------
// Actions
// ------------------------------------
export const OPEN_ATTESTATION_DIALOG = `${INTERVIEW_KEY}/OPEN_ATTESTATION_DIALOG`
export const openAttestationDialog = () => ({
  type: OPEN_ATTESTATION_DIALOG,
})

// We Clear any existing attestation decisions if we are re-opening the dialog
// since we don't know if the user has come back after doing other tasks,
// and also if any state is sticking around after changing forms this will handle that case
// as well.
actions[OPEN_ATTESTATION_DIALOG] = state => ({ ...state,
  generateFromListingRequest: false,
  isAttestDialogOpen: true,
  hasAttested: false,
  hasAgreedToSign: false,
})

export const CLOSE_ATTESTATION_DIALOG = `${INTERVIEW_KEY}/CLOSE_ATTESTATION_DIALOG`
export const closeAttestationDialog = () => ({
  type: CLOSE_ATTESTATION_DIALOG,
})

actions[CLOSE_ATTESTATION_DIALOG] = state => ({ ...state,
  isAttestDialogOpen: false,
})

export const CHANGE_ATTESTATION = `${INTERVIEW_KEY}/CHANGE_ATTESTATION`
export const changeAttestation = (checked) => ({
  type: CHANGE_ATTESTATION,
  payload: { checked },
})

actions[CHANGE_ATTESTATION] = (state, { payload }) => ({ ...state,
  hasAttested: payload.checked,
})

export const CHANGE_SIGN_AGREEMENT = `${INTERVIEW_KEY}/CHANGE_SIGN_AGREEMENT`
export const changeSignAgreement = (checked) => ({
  type: CHANGE_SIGN_AGREEMENT,
  payload: { checked },
})

actions[CHANGE_SIGN_AGREEMENT] = (state, { payload }) => ({ ...state,
  hasAgreedToSign: payload.checked,
})

export const START_PDF_CREATION = `${INTERVIEW_KEY}/START_PDF_CREATION`
export const startPdfCreation = () => ({
  type: START_PDF_CREATION,
})

actions[START_PDF_CREATION] = (state) => ({ ...state,
  generateFromListingRequest: false,
  isAttestDialogOpen: false,
  isCreatingPdf: true,
})

export const CLOSE_PDF_DIALOG = `${INTERVIEW_KEY}/CLOSE_PDF_DIALOG`
export const closePdfDialog = () => ({
  type: CLOSE_PDF_DIALOG,
})

actions[CLOSE_PDF_DIALOG] = (state) => ({ ...state,
  isCreatingPdf: false,
})

export const REQUEST_GENERATE_FROM_LISTING = `${INTERVIEW_KEY}/REQUEST_GENERATE_FROM_LISTING`
export const requestGenerateFromListingAction = () => ({
  type: REQUEST_GENERATE_FROM_LISTING,
})

actions[REQUEST_GENERATE_FROM_LISTING] = (state) => ({ ...state,
  generateFromListingRequest: true,
})

export const attest = () => async dispatch => {
  try {
    const response = await api.forms.attest()
    const form = response.data.data
    dispatch(fetchFormsSuccess([form]))

    AppToaster.show({
      message: 'Form attestation has been accepted!',
      intent: Intent.SUCCESS,
    })

    dispatch(startPdfCreation())
  } catch (error) {
    dispatch(closeAttestationDialog())
    AppToaster.show({
      message: 'Form Attestation Failed!',
      intent: Intent.DANGER,
    })
  }
}

export const requestGenerateFromListing = () => dispatch => {
  dispatch(requestGenerateFromListingAction())
}

export const SELECT_SECTION = `${INTERVIEW_KEY}/SELECT_SECTION`
export const selectSection = (id) => ({
  type: SELECT_SECTION,
  payload: { id },
})
actions[SELECT_SECTION] = (state, { payload }) => ({ ...state,
  currentSection: payload.id,
})
