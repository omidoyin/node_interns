/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * code Model
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
  const Code = sequelize.define(
    'code',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: { type: DataTypes.STRING, unique: true },
      is_used: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: 'code',
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  )

  coreModel.call(this, Code)

  Code._preCreateProcessing = function (data) {
    return data
  }
  Code._postCreateProcessing = function (data) {
    return data
  }
  Code._customCountingConditions = function (data) {
    return data
  }

  Code._filterAllowKeys = function (data) {
    let cleanData = {}
    let allowedFields = Code.allowFields()
    allowedFields.push(Code._primaryKey())

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key]
      }
    }
    return cleanData
  }

  Code.timeDefaultMapping = function () {
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

  Code.associate = function (models) {
    Code.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'user',
      constraints: false,
    })
  }

  Code.is_used_mapping = function (is_used) {
    const mapping = { 0: 'No', 1: 'Yes' }

    if (arguments.length === 0) return mapping
    else return mapping[is_used]
  }

  Code.status_mapping = function (status) {
    const mapping = { 0: 'Inactive', 1: 'Active', 2: 'Suspend' }

    if (arguments.length === 0) return mapping
    else return mapping[status]
  }

  Code.allowFields = function () {
    return ['user_id', 'id', 'code', 'is_used', 'status']
  }

  Code.labels = function () {
    return ['ID', 'Code', 'Is Used', 'Status']
  }

  Code.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['code', 'Code', 'required'],
      ['is_used', 'Is Used', ''],
      ['status', 'Status', 'required|integer'],
    ]
  }

  Code.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['code', 'Code', 'required'],
      ['is_used', 'Is Used', ''],
      ['status', 'Status', 'required|integer'],
    ]
  }

  Code.get_user_paginated = function (db, ...rest) {
    return Code.getPaginated(...rest, [
      {
        model: db.user,
        as: 'user',
      },
    ])
  }

  Code.get_code_user = (id, db) => {
    return Code.findByPk(id, { include: [{ model: db.user, as: 'user' }] })
  }

  // ex
  Code.intersection = function (fields) {
    if (fields) {
      return intersection(
        ['id', 'code', 'is_used', 'status', 'created_at', 'updated_at'],
        Object.keys(fields)
      )
    } else return []
  }

  return Code
}
