'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Link Resolve Single
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { formatError } = require('../../utils/formatError');

module.exports = async (_, __, { db, user }) => {
  try {
    const link = await db.link.getByFields({
      status: 1,
      user_id: user.id,
    });
    return {
      success: true,
      data: link,
    };
  } catch (error) {
    return formatError(error);
  }
};
