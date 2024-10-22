const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = {
     async event({ event_id }, _, { db }, info) {
         try {
           const attributes = db.event.intersection(graphqlFields(info));
     
           return await db.event.getByPK(event_id, { attributes });
         } catch (error) {
           console.log('event -> error', error);
           return new ApolloError('InternalServerError');
         }
       },
}