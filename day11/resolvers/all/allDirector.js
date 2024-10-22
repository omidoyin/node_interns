"use strict";
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
const { last } = require('lodash');
const graphqlFields = require('graphql-fields');
// const { Director } = require('../models');

module.exports = async (_, { first, after }, { db, credential }, info) => {
  try {
    const attributes = db.director.intersection(graphqlFields(info).edges.node);

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

    const { count, rows } = await db.director.findAndCountAll(options);

    const edges = rows.map((director) => ({
      cursor: director.id,
      node: director,
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
    console.log('director -> error', error);
    return new ApolloError('InternalServerError');
  }
};
