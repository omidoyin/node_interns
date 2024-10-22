"use strict";
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
const { last } = require('lodash');
const graphqlFields = require('graphql-fields');
// const { Review } = require('../models');

module.exports = async (_, { first, after }, { db, credential }, info) => {
  try {
    const attributes = db.review.intersection(graphqlFields(info).edges.node);

    const options = {
      where: {},
      limit: first,
      attributes,
    };

    if (after) {
      options.where = {
        id: {
          [Sequelize.Op.gt]: after,
        },
      };
    }

    const { count, rows } = await db.review.findAndCountAll(options);

    const edges = rows.map((review) => ({
      cursor: review.id,
      node: review,
    }));

    const pageInfo = {
      endCursor: last(edges).cursor,
      hasNextPage: 0 < count - first,
    };

    return {
      edges,
      pageInfo,
    };
  } catch (error) {
    console.log('review -> error', error);
    return new ApolloError('InternalServerError');
  }
};
