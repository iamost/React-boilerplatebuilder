import { createAction, handleActions } from 'redux-actions';
import { requestSuccess, requestFail } from 'utils/request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TEMPLATES = 'GET_TEMPLATES';

export const ADD_FOLDER = 'ADD_FOLDER';
export const UPDATE_FOLDER = 'UPDATE_FOLDER';

export const ADD_CONTENT = 'ADD_CONTENT';
export const UPDATE_CONTENT = 'UPDATE_CONTENT';

export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';

export const MOVE_TEMPLATE = 'MOVE_TEMPLATE';

export const OPEN_FOLDER = 'OPEN_FOLDER';

// ------------------------------------
// Actions
// ------------------------------------

export const getTemplates = createAction(GET_TEMPLATES);

export const addFolder = createAction(ADD_FOLDER);
export const updateFolder = createAction(UPDATE_FOLDER);

export const addContent = createAction(ADD_CONTENT);
export const updateContent = createAction(UPDATE_CONTENT);

export const moveTemplate = createAction(MOVE_TEMPLATE);

export const deleteTemplate = createAction(DELETE_TEMPLATE);

export const openFolder = createAction(OPEN_FOLDER);

const initialState = {
  templates: null,
  status: 'INIT',
  error: null,
  opens: {}
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [requestSuccess(GET_TEMPLATES)]: (state, { payload }) => ({
      ...state,
      templates: payload,
      status: requestSuccess(GET_TEMPLATES)
    }),

    [requestFail(GET_TEMPLATES)]: (state, { payload }) => ({
      ...state,
      status: requestFail(GET_TEMPLATES),
      error: payload
    }),

    [OPEN_FOLDER]: (state, { payload }) => ({
      ...state,
      opens: { ...state.opens, [payload.id]: payload.open },
    })
  },
  initialState
);
