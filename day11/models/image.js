/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * image Model
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
  const Image = sequelize.define(
    "image",
    {

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: DataTypes.TEXT,
      caption: DataTypes.TEXT,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "image",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Image);

  Image._preCreateProcessing = function (data) {
    data.status = 1;
    data.refer = 1;
    return data;
  };
  Image._postCreateProcessing = function (data) {

    return data;
  };
  Image._customCountingConditions = function (data) {

    return data;
  };

  Image._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Image.allowFields();
    allowedFields.push(Image._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Image.timeDefaultMapping = function () {
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

  Image.associate = function (models) {
    Image.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
      constraints: false,
    })
  };


  Image.type_mapping = function (type) {
    const mapping = { "0": "Server Hosted", "1": "External Link", "2": "S3", "3": "Cloudinary", "4": "File", "5": "External File", "6": "Custom" }

    if (arguments.length === 0) return mapping;
    else return mapping[type];
  };


  Image.status_mapping = function (status) {
    const mapping = { "0": "Inactive", "1": "Active" }

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };


  Image.allowFields = function () {
    return ["user_id", 'id', 'url', 'caption', 'width', 'height', 'type', 'status',];
  };

  Image.labels = function () {
    return ['ID', 'URL', 'Caption', 'Width', 'Height', 'Image Type', 'Status',];
  };

  Image.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['url', 'URL', 'required'],
      ['caption', 'Caption', ''],
      ['width', 'Width', ''],
      ['height', 'Height', ''],
      ['type', 'Image Type', ''],
      ['status', 'Status', 'required|integer'],
    ];
  };

  Image.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['url', 'URL', 'required'],
      ['caption', 'Caption', ''],
      ['width', 'Width', ''],
      ['height', 'Height', ''],
      ['type', 'Image Type', ''],
      ['status', 'Status', 'required|integer'],
    ];
  };



  Image.get_user_paginated = function (db, ...rest) {
    return Image.getPaginated(...rest, [{
      model: db.user,
      as: "user"
    }])
  }


  Image.get_image_user = (id, db) => {
    return Image.findByPk(id, { include: [{ model: db.user, as: "user" }] });
  };

  // ex
  Image.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id', 'url', 'caption', 'width', 'height', 'type', 'status', 'created_at', 'updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return Image;
};
