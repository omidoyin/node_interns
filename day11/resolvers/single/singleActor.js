"use strict";
const Actor = require('../models').Actor;

module.exports = () => Actor.findAll();
