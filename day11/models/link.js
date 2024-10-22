/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * link Model
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
  const Link = sequelize.define(
    "link",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      link: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "link",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Link);

  Link._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Link._postCreateProcessing = function (data) {

    return data;
  };
  Link._customCountingConditions = function (data) {

    return data;
  };

  Link._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Link.allowFields();
    allowedFields.push(Link._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Link.timeDefaultMapping = function () {
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

  Link.associate = function (models) {
    Link.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    })
  };


  Link.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Link.allowFields = function () {
    return ["user_id", 'id', 'link', 'status',];
  };

  Link.labels = function () {
    return ['ID', 'Link', 'Status',];
  };

  Link.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['link', 'Link', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Link.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['link', 'Link', 'required'],
      ['status', 'Status', 'required|integer'],
    ];
  };



  Link.get_user_paginated = function (db, ...rest) {
    return Link.getPaginated(...rest, [{
      model: db.user,
      as: "user"
    }])
  }


  Link.get_link_user = (id, db) => {
    return Link.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Link.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'link', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Link;
};
