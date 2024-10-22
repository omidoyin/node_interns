"use strict";
module.exports = (parent, args, context, info) => {
  if (parent.event) {
    return parent.event;
  } else {
    return parent.getEvent();
  }
};
