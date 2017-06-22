import axios from 'axios'
import {
  getProviderId,
  getFormId,
} from 'api/utils'

export const get = ({ formId, providerId, include } = {}) =>
  axios.get(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}`, {
    params: { include },
  })

export const all = ({ filter, includes, providerId } = {}) =>
  axios.get(`/api/providers/${getProviderId(providerId)}/forms`, {
    params: { include: includes, filter },
  })

export const update = (data, { formId, providerId } = {}) =>
  axios.patch(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}`, { data })

export const updateField = (value, fieldId, { formId, providerId } = {}) =>
  axios.patch(
    `/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/field`,
    { data: { value, field_id: fieldId } }
  )

export const updateSignature = (file, category, name, { formId, providerId } = {}) =>
  axios.post(
    `/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/update_signature`,
    { data: { file, category, name, type: 'png' } }
  )

export const attest = ({ providerId, formId } = {}) =>
  axios.patch(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/attest`)

export const copyTemplate = (name, templateId, { providerId } = {}) =>
  axios.post(`/api/providers/${getProviderId(providerId)}/forms/assign`, {
    data: {
      name,
      form_template_id: templateId,
    },
  })

export const generatePdf = ({ name, providerId, formId, replacePdfId } = {}) =>
  axios.post(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/generate`, {
    data: {
      name,
      replace_document_id: replacePdfId,
    },
  })

export const restore = ({ formId, providerId } = {}) =>
  axios.post(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/restore`)

export const archive = ({ formId, providerId } = {}) =>
  axios.post(`/api/providers/${getProviderId(providerId)}/forms/${getFormId(formId)}/archive`)
