'use strict';

import 'babel-polyfill';

import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';
import qs from 'qs';

import router from './router';

function loadEnv() {
  let data = fs.readFileSync(path.join(__dirname, 'env.json'), 'utf8');
  let env = JSON.parse(data);
  _.extend(process.env, env);
}

function normalizeEvent(event) {
  if (typeof event._formData === 'string') {
    return qs.parse(event._formData);
  }
  return event;
}

exports.handler = (event, context) => {
  loadEnv();
  event = normalizeEvent(event);
  router(event, context);
}
