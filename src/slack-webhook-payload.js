'use strict';

import _ from 'lodash';

const PROPS = [
  'token', 'team_id', 'team_domain', 'channel_id', 'channel_name',
  'timestamp', 'user_id', 'user_name', 'text', 'trigger_word',
];

// Adapted from http://stackoverflow.com/a/6969486/454997
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export default class SlackWebhookPayload {
  constructor(obj) {
    _.extend(this, _.pick(obj, PROPS));
  }

  isMentionOfUser(name) {
    let mentionRegExp = new RegExp('^@?' + escapeRegExp(name) + '\\b');
    return mentionRegExp.test(this.text);
  }

  get body() {
    let match = /^@?[^: ]+[: ] *([\s\S]*)$/.exec(this.text);
    return (match && match[1]) || this.text;
  }
}
