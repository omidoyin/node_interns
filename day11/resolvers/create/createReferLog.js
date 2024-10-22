"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * refer_log Resolve Add
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */



const { ApolloError ,UserInputError} = require('apollo-server-express');
const { Validator } = require('node-input-validator');

module.exports = async (parent, args, {db}, info) => {
  try {
    const {    type,
   status } = args;
    const v = new Validator({    type: args.type,
   status: args.status}, {    type: "required|integer",
   status: "required|integer" });

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });
    

    return await db.refer_log.insert({    type,
   status },{returnAllFields: true});
  } catch (error) {
    console.log('create_refer_log -> error', error);
    return new ApolloError('InternalServerError');
  }
};
