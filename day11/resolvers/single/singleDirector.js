"use strict";
const Director = require('../models').Director;

module.exports = () => Director.findAll();
