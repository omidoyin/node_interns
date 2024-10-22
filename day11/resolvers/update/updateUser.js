'use strict'
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Update User Resolver
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const TimezoneService = require('../../services/TimezoneService')

const { validateInputForGraphql } = require('../../services/ValidationService')
const { formatError } = require('../../utils/formatError')
const { errorCodes } = require('../../core/strings')

const timezoneService = new TimezoneService()

const inputValidations = {
  Mutation: {
    updateUser: (resolver = () => null) => {
      return validateInputForGraphql(
        resolver,
        {
          time_zone: 'string',
          time_format: 'integer|min:1|max:2',
          clock_format: 'integer|min:1|max:2',
          date_format: 'integer|min:1|max:2',
          location: 'string',
          lat: 'decimal',
          lng: 'decimal',
        },
        {
          'time_zone.string': 'Timezone should be a string.',
          'time_format.integer':
            'Time format field should be an integer. Can be 1 for `AM/PM format` and 2 for `24 hours format`.',
          'time_format.min':
            'Invalid value. Can be 1 for `AM/PM format` and 2 for `24 hours format`.',
          'time_format.max':
            'Invalid value.Can be 1 for `AM/PM format` and 2 for `24 hours format`.',

          'clock_format.integer':
            'Clock format field should be an integer. Can be 1 for `Digital` and 2 for `Analog`.',
          'clock_format.min':
            'Invalid value. Can be 1 for `Digital` and 2 for `Analog`.',
          'clock_format.max':
            'Invalid value. Can be 1 for `Digital` and 2 for `Analog`.',

          'date_format.integer':
            'Date format field should be an integer. Can be 1 for `Standard (dd-mm-yyyy)` and 2 for `Locale (1st April 2021)`.',
          'date_format.min':
            'Invalid value. Can be 1 for `Standard (dd-mm-yyyy)` and 2 for `Locale (1st April 2021)`.',
          'date_format.max':
            'Invalid value. Can be 1 for `Standard (dd-mm-yyyy)` and 2 for `Locale (1st April 2021)`.',
        }
      )
    },
  },
}

module.exports = inputValidations.Mutation.updateUser(
  async (
    _,
    {
      sync_code,
      font_color,
      time_zone,
      time_format,
      clock_format,
      date_format,
      location,
      lat,
      lng,
    },
    { db, user }
  ) => {
    try {
      if (time_zone?.length) {
        const isValidTimezone = timezoneService.validateTimeZone(time_zone)
        if (!isValidTimezone) {
          return {
            success: false,
            message:
              'Invalid timezone. Pass the correct timezone abbreviation.',
          }
        }
      }

      if (sync_code?.length) {
        const syncCodeExists = await db.code.getByFields({
          code: sync_code,
        })
        if (syncCodeExists && +syncCodeExists.user_id !== +user.id) {
          return {
            success: false,
            message: 'Sync code already exists.',
            code: errorCodes.extra.SYNC_CODE_ALREADY_EXISTS,
          }
        }
        await db.code.editByField({ code: sync_code }, { user_id: user.id })
      }

      const fields = {
        ...(font_color?.length ? { font_color } : {}),
        ...(time_zone?.length ? { time_zone } : {}),
        ...(time_format ? { time_format } : {}),
        ...(clock_format ? { clock_format } : {}),
        ...(date_format ? { date_format } : {}),
        ...(location?.length ? { location } : {}),
        ...((lat !== undefined || lat !== null) &&
        (lng !== undefined || lng !== null)
          ? { lat, lng }
          : {}),
      }
      if (Object.entries(fields)?.length) {
        await db.user.edit(fields, user.id)
      }
      return {
        success: true,
        message: 'User settings updated successfully.',
      }
    } catch (error) {
      return formatError(error)
    }
  }
)
