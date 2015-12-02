'use strict';

import Promise from 'bluebird';
import request from 'request';

import SlackClient from '../slack-client';

class EchoHandler {
  willHandle(payload) {
    return /^echo ([\s\S]*)$/i.exec(payload.body);
  }

  perform(payload, context, match) {
    let text = match[1];
    let slack = SlackClient.withDefaultConfig();
    slack.postAndDone('chat.postMessage', {
      channel: payload.channel_id,
      text: text,
      username: process.env['BOT_NAME'] || 'bot',
      as_user: false,
    }, context);
  }
}

export default new EchoHandler();
