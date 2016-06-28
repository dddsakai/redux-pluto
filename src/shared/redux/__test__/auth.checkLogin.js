/* eslint-disable no-undefined */
import { test } from 'eater/runner';
import assert from 'power-assert';
import Fetchr from 'fetchr';
import { ACCESS_TOKEN_AUDIENCE_NAME, sign } from '../../../server/services/AccessToken';
import { checkLogin } from '../modules/auth';
import { createWithSignedStore, createStore } from './lib/storeUtils';
import configs from '../../../server/configs';

/**
 * mock accessToken service
 */
Fetchr.registerService({
  name: 'accessToken',
  create(req, resource, params, body, config, cb) {
    cb(null, null);
  },
  delete(req, resource, params, config, cb) {
    cb(null, null);
  },
});

test('auth: checkLogin success', () => {
  const checkLoginAction = checkLogin();
  createWithSignedStore(
    'scott',
    ACCESS_TOKEN_AUDIENCE_NAME,
    {},
  ).then((store) => {
    store.dispatch(checkLoginAction).then(() => {
      assert.deepEqual(store.getState().auth, {
        login: true,
        username: 'scott',
      });
    });
  });
});

test('auth: checkLogin failure', (done, fail) => {
  const checkLoginAction = checkLogin();

  const store = createStore({
    cookie: {},
  });

  store.dispatch(checkLoginAction).then(fail, (e) => {
    assert.deepEqual(store.getState().auth, {
      login: false,
      username: undefined,
    });
    assert(e.message === 'no token');
    return done();
  });
});