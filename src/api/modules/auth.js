import { createAction, handleActions } from 'redux-actions'
import { requestSuccess, requestFail } from 'utils/request'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SIGNUP = 'SIGNUP'
export const RECOVER_PASSWORD = 'RECOVER_PASSWORD'
export const NEW_PASSWORD = 'NEW_PASSWORD'

// ------------------------------------
// Actions
// ------------------------------------

export const logIn = createAction(LOGIN)
export const logOut = createAction(LOGOUT)
export const signUp = createAction(SIGNUP)
export const recoverPassword = createAction(RECOVER_PASSWORD);
export const newPassword = createAction(NEW_PASSWORD);

const token = localStorage.getItem('token')

const initialState = {
  token,
  status: 'INIT',
  error: null,
}
// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [requestSuccess(LOGIN)]: (state, { payload }) => ({
      ...state,
      token: payload,
      status: requestSuccess(LOGIN),
      error: null,      
    }),

    [requestFail(LOGIN)]: (state, { payload }) => ({
      ...state,
      token: null,
      status: requestFail(LOGIN),
      error: payload,
    }),

    [requestSuccess(LOGOUT)]: (state, { payload }) => ({
      ...state,
      token: null,
      status: requestSuccess(LOGOUT),
      error: null
    }),

    [requestFail(LOGOUT)]: (state, { payload }) => ({
      ...state,
      status: requestFail(LOGOUT),
      token: null,
      error: payload,
    }),

    [requestSuccess(SIGNUP)]: (state, { payload }) => ({
      ...state,
      token: payload,
      status: requestSuccess(SIGNUP),
      error: null
    }),

    [requestFail(SIGNUP)]: (state, { payload }) => ({
      ...state,
      token: null,
      status: requestFail(SIGNUP),
      error: payload,
    }),

    [requestSuccess(RECOVER_PASSWORD)]: (state, { payload }) => ({
      ...state,
      status: requestSuccess(RECOVER_PASSWORD),
      error: null,
      token: null
    }),

    [requestFail(RECOVER_PASSWORD)]: (state, { payload }) => ({
      ...state,
      status: requestFail(RECOVER_PASSWORD)         
    }),

    [requestSuccess(NEW_PASSWORD)]: (state, { payload }) => ({
      ...state,
      status: requestSuccess(NEW_PASSWORD),
      error: null,
      token: null
    }),

    [requestFail(NEW_PASSWORD)]: (state, { payload }) => ({
      ...state,
      status: requestFail(NEW_PASSWORD),
      token: null
    }),
  },
  initialState
)
