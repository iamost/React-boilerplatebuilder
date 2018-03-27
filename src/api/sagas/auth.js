
import { takeLatest } from 'redux-saga/effects'
import { LOGIN, LOGOUT, SIGNUP, RECOVER_PASSWORD, NEW_PASSWORD } from 'api/modules/auth'
import request from 'utils/request'


const doLogin = request({
  type: LOGIN,
  method: 'POST',
  url: 'login',
  success: (res, action) => {
    localStorage.setItem('token', JSON.stringify(res.data));
  },
});

const doLogout = request({
  type: LOGOUT,
  method: 'POST',
  url: 'logout',
  success: (res, action) => {
    localStorage.removeItem('token');
  },
  fail: (res, action) => {
    localStorage.removeItem('token');
  },
});

const doSignup = request({
  type: SIGNUP,
  method: 'POST',
  url: 'signup',
  success: (res, action) => {
    localStorage.setItem('token', JSON.stringify(res.data));
  },
});

const doRecoverPassword = request({
  type: RECOVER_PASSWORD,
  method: 'POST',
  url: 'recover/password',
  success: (res, action) => {
    localStorage.setItem('token', JSON.stringify(res.data));
  },
});

const doNewPassword = request({
  type: NEW_PASSWORD,
  method: 'POST',
  url: 'new/password',  
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  success: (res, action) => {
    localStorage.removeItem('token')
  },
})

export default function* rootSaga() {
  yield takeLatest(LOGIN, doLogin)
  yield takeLatest(LOGOUT, doLogout)
  yield takeLatest(SIGNUP, doSignup)
  yield takeLatest(RECOVER_PASSWORD, doRecoverPassword)
  yield takeLatest(NEW_PASSWORD, doNewPassword)
}
