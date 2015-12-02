'use strict';

import * as path from 'path';
import _ from 'lodash';
import glob from 'glob';

import Dispatcher from './dispatcher';
import SlackWebhookPayload from './slack-webhook-payload';

function loadHandlers(handlersDir) {
  let pattern = path.join(__dirname, handlersDir, '*.js');
  return glob.sync(pattern).map((file) => {
    let mod = require(file);
    return mod.default || mod;
  });
}

function isScheduledEvent(event) {
  return event.source === 'aws.events' && event['detail-type'] === 'Scheduled Event';
}

function isSlackWebhook(event) {
  return event.token === process.env['SLACK_WEBHOOK_TOKEN'];
}

function handleScheduledEvent(event, context) {
  let dispatcher = new Dispatcher(loadHandlers('scheduled-event-handlers'));
  dispatcher.dispatch(event, context) || context.fail({});
}

function handlePayload(payload, context) {
  let botNames = _.compact([process.env['BOT_SHORT_NAME'], process.env['BOT_NAME']]);
  if (!_.any(botNames, (name) => payload.isMentionOfUser(name))) {
    context.succeed({});
    return;
  }
  let dispatcher = new Dispatcher(loadHandlers('slack-webhook-handlers'));
  dispatcher.dispatch(payload, context) || context.fail({});
}

export default (event, context) => {
  if (isScheduledEvent(event)) {
    handleScheduledEvent(event, context);
  } else if (isSlackWebhook(event)) {
    let payload = new SlackWebhookPayload(event);
    handlePayload(payload, context);
  } else {
    context.fail({});
  }
}
