import axios from "axios";
import { call, put } from "redux-saga/effects";
import { get } from "lodash";

export const requestPending = type => `${type}/pending`;

export const requestSuccess = type => `${type}/success`;

export const requestFail = type => `${type}/fail`;

const defaultHeaders = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  axios.defaults.baseURL = process.env.API_ROOT + "/";
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  };

  if (token) {
    headers["X-API-TOKEN"] = token;
  }

  return headers;
};

export default ({
  type,
  method,
  url,
  headers,
  success,
  fail,
  payloadOnSuccess,
  payloadOnFail
}) =>
  function*(action) {
    const { body, params, success: successCallback, fail: failCallback } =
      action.payload || {};

    try {
      yield put({
        type: requestPending(type)
      });
      const res = yield call(axios.request, {
        url,
        method: method.toLowerCase(),
        headers: Object.assign({}, defaultHeaders(), headers),
        data: body,
        params
      });

      successCallback && successCallback(res);
      success && success(res, action);

      yield put({
        type: requestSuccess(type),
        payload: payloadOnSuccess
          ? payloadOnSuccess(res.data, action)
          : res.data
      });
    } catch (err) {

      const errRes = get(err, "response", err);
      failCallback && failCallback(errRes);
      fail && fail(errRes);

      yield put({
        type: requestFail(type),
        payload: payloadOnFail ? payloadOnFail(errRes, action) : errRes
      });
    }
  };
