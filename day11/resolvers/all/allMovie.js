// "use strict";
// const { ApolloError } = require('apollo-server-express');
// const Sequelize = require('sequelize');
// const { last } = require('lodash');
// const graphqlFields = require('graphql-fields');
// // const { Movie } = require('../models');

// module.exports = async (_, { first, after }, { db, credential }, info) => {
//   try {
//     console.log("db", db, credential);

//     const attributes = db.movie.intersection(graphqlFields(info).edges.node);

//     const options = {
//       where: {},
//       limit: first,
//       attributes,
//     };

//     if (after) {
//       options.where = {
//         id: {
//           [Sequelize.Op.gt]: after,
//         },
//       };
//     }

//     const { count, rows } = await db.movie.findAndCountAll(options);

//     const edges = rows.map((movie) => ({
//       cursor: movie.id,
//       node: movie,
//     }));

//     const pageInfo = {
//       endCursor: last(edges).cursor,
//       hasNextPage: 0 < count - first,
//     };

//     return {
//       edges,
//       pageInfo,
//     };
//   } catch (error) {
//     console.log('movie -> error', error);
//     return new ApolloError('InternalServerError');
//   }
// };

const { Movie } = require("../../models");
// console.log("Movie", Movie);

module.exports = async() => {
    try {
        const movies = await Movie.findAll(); // Assuming `Movie` is your Sequelize model
        return {
          data: movies.map(movie => movie.toJSON()) // or use movie.dataValues
        };
      } catch (error) {
        console.error('Error fetching movies:', error);
        return null;
      }
};
