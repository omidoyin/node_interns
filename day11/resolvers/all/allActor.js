"use strict";
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
const { last } = require('lodash');
const graphqlFields = require('graphql-fields');
// const { Actor } = require('../models');

module.exports = async (_, { first, after }, { db, credential }, info) => {
  try {
    const attributes = db.actor.intersection(graphqlFields(info).edges.node);

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

    const { count, rows } = await db.actor.findAndCountAll(options);

    const edges = rows.map((actor) => ({
      cursor: actor.id,
      node: actor,
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
    console.log('actor -> error', error);
    return new ApolloError('InternalServerError');
  }
};
