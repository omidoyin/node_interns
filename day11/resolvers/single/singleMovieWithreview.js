"use strict";
const { Op } = require('sequelize');
const Movie = require('../models').Movie;

module.exports = (_, { threshold }) => {
  return Movie.findAll({
    where: {
      review: {
        [Op.gt]: threshold,
      },
    },
  });
};
