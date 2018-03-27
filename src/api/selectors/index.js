import { get } from 'lodash'

export const authStateSelector = state => get(state, 'auth')

export const isAuthenticated = state => !!get(state, 'auth.token')

export const getDocumentId = state => get(state.document, 'documentId')