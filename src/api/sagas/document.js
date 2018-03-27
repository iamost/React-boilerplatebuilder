import { takeLatest, takeEvery, call } from 'redux-saga/effects';
import {
  GET_DOCUMENTS,
  GET_DOCUMENT,
  CREATE_DOCUMENT,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  SEARCH_DOCUMENT,
  UPDATE_SETTINGS,
  IMPORT_FIELDS,
  REQUEST_DOCUMENT,
  LEFT_UPDATE_DOCUMENT,
  RIGHT_UPDATE_DOCUMENT,
  UP_UPDATE_DOCUMENT,
  DOWN_UPDATE_DOCUMENT,
  UPDATE_SELECTION,
  DELETE_SELECTION,
  CREATE_SELECTION,
  UP_TEXTBLOCK,
  DOWN_TEXTBLOCK,
  EDIT_TEXTBLOCK,
  DELETE_TEXTBLOCK,
} from 'api/modules/document';

import request from 'utils/request';

const getDocuments = request({
  type: GET_DOCUMENTS,
  method: 'GET',
  url: 'my/documents',
});

const createDocument = request({
  type: CREATE_DOCUMENT,
  method: 'POST',
  url: 'document',
});

const updateDocument = request({
  type: UPDATE_DOCUMENT,
  method: 'PUT',
  url: 'document',
});

const deleteDocument = function*(action) {
  const apiRequest = request({
    type: DELETE_DOCUMENT,
    method: 'DELETE',
    url: 'document/' + action.payload.id,
    success: action.payload.success,
  });
  yield call(apiRequest, action.payload);
};

const searchDocument = function*(action) {
  const apiRequest = request({
    type: SEARCH_DOCUMENT,
    method: 'GET',
    url: 'my/documents/' + action.payload.searchValue,
  });
  yield call(apiRequest, action.payload);
};

const getDocument = function*({ payload }) {
  const { documentId } = payload;
  const apiRequest = request({
    type: GET_DOCUMENT,
    method: 'GET',
    url: 'document/' + documentId,
  });
  yield call(apiRequest, payload);
};

const upUpdateDocument = function*({ payload }) {
  const { documentId, selectionId } = payload;
  const apiRequest = request({
    type: UP_UPDATE_DOCUMENT,
    method: 'POST',
    url: `move/selection/${documentId}/${selectionId}/up`,
  });
  yield call(apiRequest, payload);
};

const downUpdateDocument = function*({ payload }) {
  const { documentId, selectionId } = payload;
  const apiRequest = request({
    type: DOWN_UPDATE_DOCUMENT,
    method: 'POST',
    url: `move/selection/${documentId}/${selectionId}/down`,
  });
  yield call(apiRequest, payload);
};

const rightUpdateDocument = function*({ payload }) {
  const { documentId, selectionId } = payload;
  const apiRequest = request({
    type: RIGHT_UPDATE_DOCUMENT,
    method: 'POST',
    url: `move/selection/${documentId}/${selectionId}/right`,
  });
  yield call(apiRequest, payload);
};

const leftUpdateDocument = function*({ payload }) {
  const { documentId, selectionId } = payload;
  const apiRequest = request({
    type: LEFT_UPDATE_DOCUMENT,
    method: 'POST',
    url: `move/selection/${documentId}/${selectionId}/left`,
  });
  yield call(apiRequest, payload);
};

const updateSettings = function*(action) {
  const apiRequest = request({
    type: UPDATE_SETTINGS,
    method: 'PUT',
    url: 'document/' + action.payload.id + '/settings',
  });
  yield call(apiRequest, action);
};

const importFields = function*(action) {
  const data = new FormData();
  const apiRequest = request({
    type: IMPORT_FIELDS,
    method: 'POST',
    url: 'autofill/import/' + action.payload.id,
  });

  data.append('file', action.payload.file);

  yield call(apiRequest, { ...action, payload: { ...action.payload, body: data }});
};

const requestDocument = function*(action) {
  const apiRequest = request({
    type: REQUEST_DOCUMENT,
    method: 'POST',
    url: `request/document/${action.payload.id}`,
  });
  yield call(apiRequest, action.payload);
};
const deleteSelection = function*({ payload }) {
  const { documentId, selectionId } = payload;
  const apiRequest = request({
    type: DELETE_SELECTION,
    method: 'DELETE',
    url: `selection/${documentId}/${selectionId}`,
  });
  yield call(apiRequest, payload);
};

const updateSelection = function*({ payload }) {
  const apiRequest = request({
    type: UPDATE_SELECTION,
    method: 'PUT',
    url: 'selection',
  });
  yield call(apiRequest, payload);
};

const createSelection = function*({ payload }) {
  const apiRequest = request({
    type: CREATE_SELECTION,
    method: 'POST',
    url: 'selection',
  });
  yield call(apiRequest, payload);
};

const downTextblock = function*({ payload }) {
  const apiRequest = request({
    type: DOWN_TEXTBLOCK,
    method: 'POST',
    url: 'move/content/down',
  });
  yield call(apiRequest, payload);
};

const upTextblock = function*({ payload }) {
  const apiRequest = request({
    type: UP_TEXTBLOCK,
    method: 'POST',
    url: 'move/content/up',
  });
  yield call(apiRequest, payload);
};

const editTextblock = function*({ payload }) {
  const apiRequest = request({
    type: EDIT_TEXTBLOCK,
    method: 'PUT',
    url: 'selection',
  });
  yield call(apiRequest, payload);
};

const deleteTextblock = function*({ payload }) {
  const apiRequest = request({
    type: DELETE_TEXTBLOCK,
    method: 'PUT',
    url: 'selection',
  });
  yield call(apiRequest, payload);
};

export default function* rootSaga() {
  yield takeLatest(GET_DOCUMENTS, getDocuments);
  yield takeLatest(GET_DOCUMENT, getDocument);
  yield takeLatest(SEARCH_DOCUMENT, searchDocument);
  yield takeEvery(DOWN_TEXTBLOCK, downTextblock);
  yield takeEvery(UP_TEXTBLOCK, upTextblock);
  yield takeEvery(EDIT_TEXTBLOCK, editTextblock);
  yield takeEvery(DELETE_TEXTBLOCK, deleteTextblock);
  yield takeEvery(CREATE_SELECTION, createSelection);
  yield takeEvery(UPDATE_SELECTION, updateSelection);
  yield takeEvery(DELETE_SELECTION, deleteSelection);
  yield takeEvery(LEFT_UPDATE_DOCUMENT, leftUpdateDocument);
  yield takeEvery(RIGHT_UPDATE_DOCUMENT, rightUpdateDocument);
  yield takeEvery(UP_UPDATE_DOCUMENT, upUpdateDocument);
  yield takeEvery(DOWN_UPDATE_DOCUMENT, downUpdateDocument);
  yield takeEvery(GET_DOCUMENT, getDocument);
  yield takeEvery(CREATE_DOCUMENT, createDocument);
  yield takeEvery(UPDATE_DOCUMENT, updateDocument);
  yield takeEvery(DELETE_DOCUMENT, deleteDocument);
  yield takeEvery(UPDATE_SETTINGS, updateSettings);
  yield takeEvery(IMPORT_FIELDS, importFields);
  yield takeEvery(REQUEST_DOCUMENT, requestDocument);
}
