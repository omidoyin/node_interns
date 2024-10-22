/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * role Model
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
  const Role = sequelize.define(
    "role",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, validate: {} },
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "role",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Role);

  Role._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Role._postCreateProcessing = function (data) {

    return data;
  };
  Role._customCountingConditions = function (data) {

    return data;
  };

  Role._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Role.allowFields();
    allowedFields.push(Role._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Role.timeDefaultMapping = function () {
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

  Role.associate = function (models) { };


  Role.status_mapping = function (status) {
    const mapping = { "0": "Pending", "1": "Confirmed", "2": "Paid" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Role.allowFields = function () {
    return ['id', 'name', 'status',];
  };

  Role.labels = function () {
    return ['ID', 'Role Name', 'Status',];
  };

  Role.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['name', 'Role Name', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Role.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['name', 'Role Name', 'required'],
      ['status', 'Status', ''],
    ];
  };






  // ex
  Role.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'name', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Role;
};
