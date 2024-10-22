"use strict";
const Review = require('../models').Review;

module.exports = () => Review.findAll();
