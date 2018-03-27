import { takeLatest, call, put } from 'redux-saga/effects';
import {
  GET_TEMPLATES,
  ADD_FOLDER,
  UPDATE_FOLDER,
  ADD_CONTENT,
  UPDATE_CONTENT,
  MOVE_TEMPLATE,
  DELETE_TEMPLATE,
  OPEN_FOLDER
} from 'api/modules/template';
import request from 'utils/request';

const getTemplates = request({
  type: GET_TEMPLATES,
  method: 'GET',
  url: 'templates'
});

function* addFolder(action) {
  yield call(
    request({
      type: ADD_FOLDER,
      method: 'POST',
      url: 'folder'
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });

  const { parentId } = action.payload.body;
  if (parentId) {
    yield put({
      type: OPEN_FOLDER,
      payload: { id: parentId, open: true }
    });
  }
}

function* updateFolder(action) {
  yield call(
    request({
      type: UPDATE_FOLDER,
      method: 'PUT',
      url: `folder/${action.payload.id}`
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });
}

function* addContent(action) {
  yield call(
    request({
      type: ADD_CONTENT,
      method: 'POST',
      url: 'template'
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });

  const { parentTemplateId } = action.payload.body;
  if (parentTemplateId) {
    yield put({
      type: OPEN_FOLDER,
      payload: { id: parentTemplateId, open: true }
    });
  }
}

function* updateContent(action) {
  yield call(
    request({
      type: UPDATE_CONTENT,
      method: 'PUT',
      url: 'template'
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });
}

function* moveTemplate(action) {
  yield call(
    request({
      type: MOVE_TEMPLATE,
      method: 'POST',
      url: `/move/template/${action.payload.from}/${action.payload.where}/${action.payload.to}`
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });

  yield put({
    type: OPEN_FOLDER,
    payload: { id: action.payload.to, open: true }
  });
}

function* deleteTemplate(action) {
  yield call(
    request({
      type: DELETE_TEMPLATE,
      method: 'DELETE',
      url: `template/${action.payload.id}`
    }),
    action
  );
  yield call(getTemplates, { type: GET_TEMPLATES });
}

export default function* rootSaga() {
  yield takeLatest(GET_TEMPLATES, getTemplates);
  yield takeLatest(ADD_FOLDER, addFolder);
  yield takeLatest(UPDATE_FOLDER, updateFolder);
  yield takeLatest(ADD_CONTENT, addContent);
  yield takeLatest(UPDATE_CONTENT, updateContent);
  yield takeLatest(MOVE_TEMPLATE, moveTemplate);
  yield takeLatest(DELETE_TEMPLATE, deleteTemplate);
}
