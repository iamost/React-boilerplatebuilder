import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import auth from 'api/modules/auth'
import template from 'api/modules/template'
import document from 'api/modules/document'

export default combineReducers({
  routing: routerReducer,
  auth,
  template,
  document
})
