"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * profile Resolve Update
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
    const {    timezone,
   dashboard_code } = args;
    const v = new Validator({    timezone: args.timezone,
   dashboard_code: args.dashboard_code}, {    timezone: "required",
   dashboard_code: "required" });

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });    
    return await db.profile.edit({    timezone,
   dashboard_code }, args.id);
  } catch (error) {
    console.log('update_profile -> error', error);
    return new ApolloError('InternalServerError');
  }
};
