'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * links Resolve Deactivate
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { formatError } = require('../../utils/formatError');

module.exports = async (_, __, { db, user }) => {
  try {
    const previousLinks = await db.link.getAll({ user_id: user.id, status: 1 });
    if (previousLinks?.length) {
      await db.link.update(
        { status: 0 },
        {
          where: { id: previousLinks?.map((link) => link.id) },
        },
      );
    }
    return {
      success: true,
      message: 'All links deactivated successfully.',
    };
  } catch (error) {
    return formatError(error);
  }
};
