'use strict';

export default class Dispatcher {
  constructor(handlers) {
    this.handlers = [].concat(handlers);
  }

  dispatch(subject, context) {
    for (let handler of this.handlers) {
      let data = handler.willHandle(subject, context);
      if (data) {
        handler.perform(subject, context, data);
        return true;
      }
    }
    return false;
  }
}
