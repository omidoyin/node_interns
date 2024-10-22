/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * calendar Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
;
const { Op } = require("sequelize");
const { intersection } = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    "calendar",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: DataTypes.STRING,
        unique: true
      },
      title: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "calendar",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Calendar);

  Calendar._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Calendar._postCreateProcessing = function (data) {

    return data;
  };
  Calendar._customCountingConditions = function (data) {

    return data;
  };

  Calendar._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Calendar.allowFields();
    allowedFields.push(Calendar._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Calendar.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  Calendar.associate = function (models) {
    Calendar.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    })
  };


  Calendar.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Calendar.allowFields = function () {
    return ["user_id", 'id', 'event_id', 'title', 'start_date', 'end_date', 'status',];
  };

  Calendar.labels = function () {
    return ['ID', 'Event Id', 'Title', 'Start Date', 'End Date', 'Status',];
  };

  Calendar.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['event_id', 'Event Id', ''],
      ['title', 'Title', 'required'],
      ['start_date', 'Start Date', 'required'],
      ['end_date', 'End Date', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Calendar.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['event_id', 'Event Id', ''],
      ['title', 'Title', 'required'],
      ['start_date', 'Start Date', 'required'],
      ['end_date', 'End Date', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };



  Calendar.get_user_paginated = function (db, ...rest) {
    return Calendar.getPaginated(...rest, [{
      model: db.user,
      as: "user"
    }])
  }


  Calendar.get_calendar_user = (id, db) => {
    return Calendar.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Calendar.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'event_id', 'title', 'start_date', 'end_date', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Calendar;
};
