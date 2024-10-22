"use strict";
const Movie = require('../models').Movie;

module.exports = () => Movie.findAll();
