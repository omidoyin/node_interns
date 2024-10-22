/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * user Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require('moment')

const { Op } = require('sequelize')
const { intersection } = require('lodash')
const coreModel = require('./../core/models')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      image: DataTypes.TEXT,
      image_id: DataTypes.INTEGER,
      refer: DataTypes.STRING,
      profile_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      stripe_uid: DataTypes.STRING,
      paypal_uid: DataTypes.STRING,
      font_color: DataTypes.STRING,
      time_zone: DataTypes.STRING,
      time_format: DataTypes.INTEGER,
      clock_format: DataTypes.INTEGER,
      date_format: DataTypes.INTEGER,
      location: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      expire_at: DataTypes.DATEONLY,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: 'user',
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  )

  coreModel.call(this, User)

  User._preCreateProcessing = function (data) {
    data.image = 'https://i.imgur.com/AzJ7DRw.png'
    data.refer = Math.round(Math.random() * 1000000000000, 0)
    data.status = 1
    data.verify = 0
    data.font_color = '#ffffff'
    data.time_zone = 'UTC'
    data.time_format = 1
    data.clock_format = 1
    data.date_format = 1
    data.location = ''
    if (!data.profile_id) {
      data.profile_id = 0
    }
    if (data.type) {
      data.type = 'n'
    }
    return data
  }
  User._postCreateProcessing = function (data) {
    if (data.password && data.password.length < 1) {
      delete data.password
    }
    if (data.image && data.image.length < 1) {
      delete data.image
    }

    return data
  }
  User._customCountingConditions = function (data) {
    return data
  }

  User._filterAllowKeys = function (data) {
    let cleanData = {}
    let allowedFields = User.allowFields()
    allowedFields.push(User._primaryKey())

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key]
      }
    }
    return cleanData
  }

  User.timeDefaultMapping = function () {
    let results = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? '0'.i : i
        let min = j < 10 ? '0'.j : j
        results[i * 60 + j] = `${hour}:${min}`
      }
    }
    return results
  }

  User.associate = function (models) {
    User.hasMany(models.refer_log, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasOne(models.credential, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.token, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasOne(models.code, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.admin_operation, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.member_operation, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.image, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.note, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.calendar, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasOne(models.profile, {
      foreignKey: 'user_id',
      constraints: false,
    })
    User.hasMany(models.link, {
      foreignKey: 'user_id',
      constraints: false,
    })
  }

  User.status_mapping = function (status) {
    const mapping = { 0: 'Inactive', 1: 'Active', 2: 'Suspend' }

    if (arguments.length === 0) return mapping
    else return mapping[status]
  }

  User.time_format_mapping = function (time_format) {
    const mapping = { 1: 'AM/PM', 2: '24 hours' }

    if (arguments.length === 0) return mapping
    else return mapping[time_format]
  }

  User.clock_format_mapping = function (clock_format) {
    const mapping = { 1: 'Digital', 2: 'Analog' }

    if (arguments.length === 0) return mapping
    else return mapping[clock_format]
  }

  User.date_format_mapping = function (date_format) {
    const mapping = {
      1: 'Standard (dd/mm/yyyy)',
      2: 'Locale (Wed, April 1, 2021)',
    }

    if (arguments.length === 0) return mapping
    else return mapping[date_format]
  }

  User.allowFields = function () {
    return [
      'id',
      'status',
      'first_name',
      'last_name',
      'phone',
      'image',
      'image_id',
      'refer',
      'profile_id',
      'role_id',
      'stripe_uid',
      'paypal_uid',
      'font_color',
      'time_zone',
      'time_format',
      'clock_format',
      'date_format',
      'location',
      'lat',
      'lng',
      'expire_at',
    ]
  }

  User.labels = function () {
    return [
      'ID',
      'Status',
      'First Name',
      'Last Name',
      'Phone #',
      'Image',
      'Image ID',
      'Refer Code',
      'Profile ID',
      'Role ID',
      'Stripe ID',
      'PayPal ID',
      'Font Color',
      'Timezone',
      'Time Format',
      'Clock Format',
      'Date Format',
      'Location',
      'Latitude',
      'Longitude',
      'Expire At',
    ]
  }

  User.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['status', 'Status', ''],
      ['first_name', 'First Name', 'required'],
      ['last_name', 'Last Name', 'required'],
      ['phone', 'Phone #', ''],
      ['image', 'Image', ''],
      ['image_id', 'Image ID', ''],
      ['refer', 'Refer Code', ''],
      ['profile_id', 'Profile ID', ''],
      ['role_id', 'Role ID', ''],
      ['stripe_uid', 'Stripe ID', ''],
      ['paypal_uid', 'PayPal ID', ''],
      ['font_color', 'Font Color', ''],
      ['time_zone', 'Timezone', 'required'],
      ['time_format', 'Time Format', 'required|integer'],
      ['clock_format', 'Clock Format', 'required|integer'],
      ['date_format', 'Date Format', 'required|integer'],
      ['location', 'Location', ''],
      ['lat', 'Latitude', 'required|integer'],
      ['lng', 'Longitude', ''],
      ['expire_at', 'Expire At', ''],
    ]
  }

  User.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['status', 'Status', ''],
      ['first_name', 'First Name', ''],
      ['last_name', 'Last Name', ''],
      ['phone', 'Phone #', ''],
      ['image', 'Image', ''],
      ['image_id', 'Image ID', ''],
      ['refer', 'Refer Code', ''],
      ['profile_id', 'Profile ID', ''],
      ['role_id', 'Role ID', ''],
      ['stripe_uid', 'Stripe ID', ''],
      ['paypal_uid', 'PayPal ID', ''],
      ['font_color', 'Font Color', ''],
      ['time_zone', 'Timezone', 'required'],
      ['time_format', 'Time Format', 'required|integer'],
      ['clock_format', 'Clock Format', 'required|integer'],
      ['date_format', 'Date Format', 'required|integer'],
      ['location', 'Location', ''],
      ['lat', 'Latitude', ''],
      ['lng', 'Longitude', ''],
      ['expire_at', 'Expire At', ''],
    ]
  }

  User.get_refer_log_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.refer_log,
        as: 'refer_log',
      },
    ])
  }

  User.get_credential_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.credential,
        as: 'credential',
      },
    ])
  }

  User.get_token_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.token,
        as: 'token',
      },
    ])
  }

  User.get_code_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.code,
        as: 'code',
      },
    ])
  }

  User.get_admin_operation_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.admin_operation,
        as: 'admin_operation',
      },
    ])
  }

  User.get_member_operation_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.member_operation,
        as: 'member_operation',
      },
    ])
  }

  User.get_image_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.image,
        as: 'image',
      },
    ])
  }

  User.get_note_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.note,
        as: 'note',
      },
    ])
  }

  User.get_calendar_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.calendar,
        as: 'calendar',
      },
    ])
  }

  User.get_profile_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.profile,
        as: 'profile',
      },
    ])
  }

  User.get_link_paginated = function (db, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.link,
        as: 'link',
      },
    ])
  }

  User.get_user_refer_log = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.refer_log, as: 'refer_log' }],
    })
  }
  User.get_user_credential = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.credential, as: 'credential' }],
    })
  }
  User.get_user_token = (id, db) => {
    return User.findByPk(id, { include: [{ model: db.token, as: 'token' }] })
  }
  User.get_user_code = (id, db) => {
    return User.findByPk(id, { include: [{ model: db.code, as: 'code' }] })
  }
  User.get_user_admin_operation = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.admin_operation, as: 'admin_operation' }],
    })
  }
  User.get_user_member_operation = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.member_operation, as: 'member_operation' }],
    })
  }
  User.get_user_image = (id, db) => {
    return User.findByPk(id, { include: [{ model: db.image, as: 'image' }] })
  }
  User.get_user_note = (id, db) => {
    return User.findByPk(id, { include: [{ model: db.note, as: 'note' }] })
  }
  User.get_user_calendar = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.calendar, as: 'calendar' }],
    })
  }
  User.get_user_profile = (id, db) => {
    return User.findByPk(id, {
      include: [{ model: db.profile, as: 'profile' }],
    })
  }
  User.get_user_link = (id, db) => {
    return User.findByPk(id, { include: [{ model: db.link, as: 'link' }] })
  }

  // ex
  User.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id',
          'status',
          'first_name',
          'last_name',
          'phone',
          'image',
          'image_id',
          'refer',
          'profile_id',
          'role_id',
          'stripe_uid',
          'paypal_uid',
          'font_color',
          'time_zone',
          'time_format',
          'clock_format',
          'date_format',
          'location',
          'lat',
          'lng',
          'expire_at',
          'created_at',
          'updated_at',
        ],
        Object.keys(fields)
      )
    } else return []
  }

  return User
}
