'use strict';

import _ from 'lodash';
import Promise from 'bluebird';
import request from 'request';

export default class SlackClient {
  static withDefaultConfig() {
    return new this(
      process.env['SLACK_API_URL'] || 'https://slack.com/api',
      process.env['SLACK_API_TOKEN']
    );
  }

  constructor(apiUrl, apiToken, channel) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.apiToken = apiToken;
  }

  post(endpoint, params) {
    let url = `${this.apiUrl}/${endpoint}`;
    let form = _.extend(_.clone(params), { token: this.apiToken });
    return Promise.fromCallback((callback) => {
       request.post(url, { form: form, json: true }, (error, response, body) => {
         if (!error && response.statusCode === 200 && body.ok) {
           callback(null, { error, response, body });
         } else {
           callback({ error, response, body });
         }
       });
    });
  }

  postAndDone(endpoint, params, context) {
    this.post(endpoint, params).then(({ body }) => {
      console.log({ body });
      context.succeed({});
    }).catch(({ response, body }) => {
      console.log({ statusCode: response && response.statusCode, body });
      context.fail({});
    });
  }
}
