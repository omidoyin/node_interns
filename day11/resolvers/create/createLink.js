'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * links Resolve Add
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const request = require('request-promise');

const { validateInputForGraphql } = require('../../services/ValidationService');
const { formatError } = require('../../utils/formatError');
const { errorCodes } = require('../../core/strings');

const inputValidations = {
  Mutation: {
    createLink: (resolver = () => null) => {
      return validateInputForGraphql(
        resolver,
        {
          link: 'required|string',
        },
        {
          'link.required': 'Link field is required.',
          'link.string': 'Link field should be a string.',
        },
      );
    },
  },
};

module.exports = inputValidations.Mutation.createLink(async (_, { link }, { db, user }) => {
  try {
    const previousLinks = await db.link.getAll({ user_id: user.id, status: 1 });
    try {
      const urlResponse = await request({ uri: link, resolveWithFullResponse: true, method: 'GET' });
      const headers = urlResponse?.headers;
      const xFrameHeader = headers['x-frame-options'];
      if (xFrameHeader && (xFrameHeader === 'SAMEORIGIN' || xFrameHeader === 'DENY')) {
        return {
          success: false,
          message: 'Iframe blocked to given link.',
          code: errorCodes.extra.IFRAME_BLOCKED,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Link invalid or not available at the moment.',
        code: errorCodes.extra.INVALID_URL,
      };
    }

    if (previousLinks?.length) {
      await db.link.update(
        { status: 0 },
        {
          where: { id: previousLinks?.map((link) => link.id) },
        },
      );
    }
    await db.link.insert({ link, user_id: user.id });
    return {
      success: true,
      message: 'Link inserted successfully.',
    };
  } catch (error) {
    return formatError(error);
  }
});
