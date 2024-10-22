/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * credential Model
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
  const Credential = sequelize.define(
    "credential",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: DataTypes.STRING,
      type: DataTypes.STRING,
      verify: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      two_factor_authentication: DataTypes.INTEGER,
      force_password_change: DataTypes.BOOLEAN,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "credential",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Credential);

  Credential._preCreateProcessing = function (data) {
    data.status = 1;
    data.two_factor_authentication = 0;
    return data;
  };
  Credential._postCreateProcessing = function (data) {

    return data;
  };
  Credential._customCountingConditions = function (data) {

    return data;
  };

  Credential._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Credential.allowFields();
    allowedFields.push(Credential._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Credential.timeDefaultMapping = function () {
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

  Credential.associate = function (models) {
    Credential.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    })
  };


  Credential.verify_mapping = function (verify) {
    const mapping = { "0": "Not verified", "1": "Verified" }

    if (arguments.length === 0) return mapping;
    else return mapping[verify];
  };


  Credential.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active", "2": "Suspend" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Credential.role_id_mapping = function (role_id) {
    const mapping = { "1": "Member", "2": "Admin" }

    if (arguments.length === 0) return mapping;
    else return mapping[role_id];
  };


  Credential.two_factor_authentication_mapping = function (two_factor_authentication) {
    const mapping = { "0": "No", "1": "Yes" }

    if (arguments.length === 0) return mapping;
    else return mapping[two_factor_authentication];
  };


  Credential.allowFields = function () {
    return ["user_id", 'id', 'email', 'password', 'type', 'verify', 'role_id', 'status', 'two_factor_authentication', 'force_password_change',];
  };

  Credential.labels = function () {
    return ['ID', 'Email', 'Password', 'Type', 'Verified', 'Role', 'Status', 'Two factor authentication', '',];
  };

  Credential.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['email', 'Email', 'required|valid_email'],
      ['password', 'Password', 'required'],
      ['type', 'Type', ''],
      ['verify', 'Verified', ''],
      ['role_id', 'Role', ''],
      ['status', 'Status', ''],
      ['two_factor_authentication', 'Two factor authentication', ''],
      ['force_password_change', '', ''],
    ];
  };

  Credential.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['email', 'Email', 'required|valid_email'],
      ['password', 'Password', ''],
      ['type', 'Type', ''],
      ['verify', 'Verified', ''],
      ['role_id', 'Role', ''],
      ['status', 'Status', 'required|in_list[0,1,2]'],
      ['two_factor_authentication', 'Two factor authentication', ''],
      ['force_password_change', '', ''],
    ];
  };



  Credential.get_user_paginated = function (db, ...rest) {
    return Credential.getPaginated(...rest, [{
      model: db.user,
      as: "user"
    }])
  }


  Credential.get_credential_user = (id, db) => {
    return Credential.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Credential.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'email', 'password', 'type', 'verify', 'role_id', 'status', 'two_factor_authentication', 'force_password_change', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Credential;
};
