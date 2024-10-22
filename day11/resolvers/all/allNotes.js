'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * notes Resolve All
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
const { last } = require('lodash');
const graphqlFields = require('graphql-fields');
const { QueryTypes } = require('sequelize');

module.exports = async (_, { first, after }, { db, credential }, info) => {
  //Check Auth if user allowed
  try {
    const attributes = db.notes.intersection(graphqlFields(info).edges.node);

    const options = {
      where: {},
      limit: first,
      attributes,
    };
    const users = await sequelize.query('SELECT * FROM `notes`', { type: QueryTypes.SELECT });
    console.log('Notes are: ' + users);
    if (after) {
      options.where = {
        id: {
          [Sequelize.Op.gt]: after,
        },
      };
    }

    const { count, rows } = await db.notes.findAndCountAll(options);

    const edges = rows.map((notes) => ({
      cursor: notes.id,
      node: notes,
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
    console.log('notes -> error', error);
    return new ApolloError('InternalServerError');
  }
};
