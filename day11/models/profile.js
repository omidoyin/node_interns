/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * profile Model
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
  const Profile = sequelize.define(
    "profile",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      timezone: DataTypes.STRING,
      dashboard_code: DataTypes.STRING,
      code: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "profile",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Profile);

  Profile._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Profile._postCreateProcessing = function (data) {

    return data;
  };
  Profile._customCountingConditions = function (data) {

    return data;
  };

  Profile._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Profile.allowFields();
    allowedFields.push(Profile._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Profile.timeDefaultMapping = function () {
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

  Profile.associate = function (models) {
    Profile.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "profile",
      constraints: false,
    })
  };


  Profile.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Profile.allowFields = function () {
    return ["user_id", 'id', 'timezone', 'dashboard_code', 'code', 'status',];
  };

  Profile.labels = function () {
    return ['ID', 'Timezone', 'Dashboard Code', 'Code', 'Status',];
  };

  Profile.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['timezone', 'Timezone', 'required'],
      ['dashboard_code', 'Dashboard Code', 'required'],
      ['code', 'Code', ''],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Profile.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['timezone', 'Timezone', 'required'],
      ['dashboard_code', 'Dashboard Code', 'required'],
      ['code', 'Code', ''],
      ['status', 'Status', 'required|integer'],
    ];
  };



  Profile.get_user_paginated = function (db, ...rest) {
    return Profile.getPaginated(...rest, [{
      model: db.user,
      as: "profile"
    }])
  }


  Profile.get_profile_user = (id, db) => {
    return Profile.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Profile.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'timezone', 'dashboard_code', 'code', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Profile;
};
