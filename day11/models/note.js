/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * note Model
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
  const Note = sequelize.define(
    "note",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "note",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Note);

  Note._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Note._postCreateProcessing = function (data) {

    return data;
  };
  Note._customCountingConditions = function (data) {

    return data;
  };

  Note._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Note.allowFields();
    allowedFields.push(Note._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Note.timeDefaultMapping = function () {
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

  Note.associate = function (models) {
    Note.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    })
  };


  Note.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Note.allowFields = function () {
    return ["user_id", 'id', 'message', 'status',];
  };

  Note.labels = function () {
    return ['ID', 'Message', 'Status',];
  };

  Note.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['message', 'Message', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Note.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['message', 'Message', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };



  Note.get_user_paginated = function (db, ...rest) {
    return Note.getPaginated(...rest, [{
      model: db.user,
      as: "user"
    }])
  }


  Note.get_note_user = (id, db) => {
    return Note.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Note.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'message', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Note;
};
